import { Add } from "@mui/icons-material"
import { Button } from "@mui/material"
import { GridColDef, GridRenderCellParams, GridValueFormatterParams, GridValueGetterParams } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { ICombo, IComboOrder, IOrder, IStudent } from "../../api/models_school"
import { OrderType } from "../../api/models_school/store/order.model"
import { useCombo } from "../../hooks/api/store/useCombo"
import { useComboPerOrder } from "../../hooks/api/store/useComboPerOrder"
import { useOrder } from "../../hooks/api/store/useOrder"
import { useStudent } from "../../hooks/api/store/useStudent"
import { Table } from "../Table"
import { getDialogCell } from "../Table/renders"
import { OrderProducts } from "./OrderProducts"

const useComboPerOrdersH = (orderIdP?: IOrder['id']) => {
  const useComboPerOrders = useComboPerOrder({initFetch: false})
  const useCombos = useCombo({initFetch: false})
  const [comboPerOrders, setComboPerOrder] = useState<Array<IComboOrder> | null>([])
  const [isCustom, setIsCustom] = useState(false)
  const [orderId, setOrderId] = useState(orderIdP)

  useEffect(() => {
    useComboPerOrders.fetch({searchBy: { orderId }})
  }, [orderId])

  useEffect(() => {
    if (!useComboPerOrders.data) return
    Promise.all(useComboPerOrders.data.map(async (comboPerOrder) => {
      return {
        ...comboPerOrder,
        combo: await useCombos.findOne({id: comboPerOrder.comboId}) ?? undefined
      }
    })).then((res) => {
      setComboPerOrder(res)
    })
  }, [useComboPerOrders.data, useCombos.data])

  useEffect(() => {
    setIsCustom((comboPerOrders?.length || -1) < 1)
  }, [comboPerOrders])

  const getCombosByOrderId = async (orderId: IOrder['id']) => {
    const cpo = await useComboPerOrders.findBy({orderId})
    if (!cpo) return
    const combos = await Promise.all(cpo.map(async (c) => ({
      ...await useCombos.findOne({id: c.comboId})
    })))
    return combos
  }

  const getCombosByOrdersId = async (orderId: Array<IOrder['id']>) => {
    return await Promise.all(orderId.map((id) => ({
      combos: getCombosByOrderId(id),
      orderId: id
    })))
  }

  const getCombosByOrders = async (orderId: Array<IOrder>): Promise<CombosByOrders> => {
    return await Promise.all(orderId.map( async (order) => ({
      combos: await getCombosByOrderId(order.id),
      orderId: order.id
    })))
  }

  return {
    comboPerOrders,
    getCombosByOrderId,
    getCombosByOrdersId,
    getCombosByOrders,
    isCustom,
    setOrderId
  }
}

type CombosByOrders = Array<{
    combos?: Array<Partial<ICombo>>,
    orderId: IOrder['id']
}>

const ComboDetails = (params: GridRenderCellParams<any, IOrder>) => {
  const orderId = params.row.id
  const studentName = params.row?.student?.nickName
  const { isCustom, comboPerOrders } = useComboPerOrdersH(orderId)

  return {
    dialogContent: <OrderProducts
      { ... isCustom ? { orderId } : { comboId: comboPerOrders?.at(0)?.comboId } }
      studentName={studentName ?? ''}
    />,
    preview: `${comboPerOrders?.at(0)?.combo?.name || 'Perzonalizado'}`
  }
}

const ComboValueGetter = (params: GridValueGetterParams<any, IOrder>) => {
  const orderId = params.row.id
  const { comboPerOrders } = useComboPerOrdersH(orderId)

  if (!comboPerOrders) return 'Perzonalizado'

  return comboPerOrders.reduce((c, p) => {
    return `${c}, ${p.combo?.name}`
  }, '')
}

const DetailsDialogCell = getDialogCell<IOrder>({
  title: 'Detalles',
  actions: { omitCancel: true },
})

const ComboDialogCell = getDialogCell<IOrder>({
  title: 'Detalles del combo',
  actions: { omitCancel: true },
  handleChildren: (p) => ComboDetails(p)
})

type Params = {
  type: OrderType.STUDIO
} | {
  type: OrderType.SCHOOL
  sectionPromId: IOrder['sectionPromId']
}

interface IOrderTable extends IOrder {
  comboName: string
}

export const TableOrder = (params: Params) => {
  const useOrders = useOrder({initFetch: false})
  const useStudents = useStudent({initFetch: false})
  const { getCombosByOrders } = useComboPerOrdersH()

  const [open, setOpen] = useState(false)
  const [idForUpdate, setIdForUpdate] = useState<IOrder['id']>()
  const [orders, setOrders] = useState<Array<IOrder> | null>([])
  const [isLoading, setIsLoading] = useState(true)
  const [combosPerOrder, setCombosPerOrders] = useState<CombosByOrders>([])

  useEffect(() => {
    useOrders.fetch({ searchBy: {...params} })
      .then((res) => {
        setOrders(res.data)
      })
  }, [params])

  useEffect(() => {
    if (!orders) return setIsLoading(false)
    const loading = orders.length < 1 || useOrders.needFetchNext
    setIsLoading(loading)
  }, [orders, useOrders.needFetchNext])

  useEffect(() => {
    if (!!orders?.[0]?.student || !orders) return
    Promise.all(orders.map(async (order) => ({
      ...order,
      student: await useStudents.findOne({id: order.studentId}) ?? undefined
    }))).then(res => {
      setOrders(res)
    })
  }, [orders, useStudents.data])

  useEffect(() => {
    if (!orders) return
    getCombosByOrders(orders).then((res) => {
      setCombosPerOrders(res)
    })
  }, [orders])

  useEffect(() => {
    if (idForUpdate) {
      setOpen(true)
    }
  }, [idForUpdate])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: "ID",
      type: 'string',
      disableExport: true,
      flex: 1
    },
    {
      field: 'nickName',
      headerName: 'Nombre en cuadro',
      flex: 1,
      valueGetter: ({row}: GridValueGetterParams<IStudent>) => {
        return `${row?.student?.nickName}`
      },
      hideable: false,
      type: 'string'
    },
    {
      field: 'combo.name',
      headerName: 'Combo',
      valueGetter: ({row}: GridValueGetterParams<any, IOrder>) => {
        const cpo = combosPerOrder.find((cpo) => cpo.orderId === row.id)
        const combos = cpo?.combos
        if (!combos) return 'Personalizado'
        return combos.reduce((p, c) => {
          if (p.length < 1) return c.name ?? ''
          return `${p}, ${c.name}`
        }, '')
      },
      renderCell: (p) => <ComboDialogCell {...p}/>,
      flex: 1
    },
    {
      field: 'firstName',
      headerName: 'Nombre(s)',
      flex: 1,
      valueGetter: ({row}: GridValueGetterParams<IStudent>) => {
        return `${row?.student?.firstName}`
      },
      type: 'string'
    },
    {
      field: 'lastName',
      headerName: 'Apellido(s)',
      flex: 1,
      valueGetter: ({row}: GridValueGetterParams<IStudent>) => {
        return `${row?.student?.lastName}`
      },
      type: 'string'
    },
    {
      field: 'total',
      headerName: 'Total',
      type: 'number'
    },
    {
      field: 'remaining',
      headerName: 'Restante',
      type: 'number'
    },
    {
      field: 'details',
      headerName: 'Detalles',
      renderCell: (p) => <DetailsDialogCell {...p}/>,
      flex: 1
    }
  ]

  return <>
    {// <OrderFormModal state={[open, setOpen]} idForUpdate={idForUpdate} noButton/>
    }
    <Table
      columns={columns}
      rows={orders ?? []}
      onPagination={(limit, offset) => {
        useOrders.launchNextFetch({limit, offset})
      }}
      columnVisibilityModel={{
        lastName: false,
        firstName: false
      }}
      isLoading={isLoading}
      count={useOrders.metadata?.count ?? 0}
      name="Bordes de productos"
      deleteAction={(id) => console.log(id)}
      editAction={(id) => setIdForUpdate(id)}
      toolbar={{
        add: <Button startIcon={<Add/>} onClick={() => {
          setIdForUpdate(undefined)
          setOpen(true)
        }}>
          Nuevo
        </Button>
      }}
    />
  </>
}
