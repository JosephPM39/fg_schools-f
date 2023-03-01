import { Add } from "@mui/icons-material"
import { Button } from "@mui/material"
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { IOrder, IStudent } from "../../api/models_school"
import { OrderType } from "../../api/models_school/store/order.model"
import { Dialog } from "../../containers/Dialog"
import { useCombo } from "../../hooks/api/store/useCombo"
import { useComboPerOrder } from "../../hooks/api/store/useComboPerOrder"
import { useOrder } from "../../hooks/api/store/useOrder"
import { useStudent } from "../../hooks/api/store/useStudent"
import { Table } from "../Table"
import { getDialogCell } from "../Table/renders"

type Params = {
  type: OrderType.STUDIO
} | {
  type: OrderType.SCHOOL
  sectionPromId: IOrder['sectionPromId']
}

export const TableOrder = (params: Params) => {
  const useOrders = useOrder({initFetch: false})
  const useStudents = useStudent({initFetch: false})
  // const useCombos = useCombo({initFetch: false})
  // const useComboPerOrders = useComboPerOrder({initFetch: false})

  const [open, setOpen] = useState(false)
  const [idForUpdate, setIdForUpdate] = useState<IOrder['id']>()
  const [orders, setOrders] = useState<Array<IOrder> | null>([])
  const [isLoading, setIsLoading] = useState(true)

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
    if (idForUpdate) {
      setOpen(true)
    }
  }, [idForUpdate])

  const DialogCell = getDialogCell({
    title: 'Detalles',
    actions: { omitCancel: true },
    previewLimit: 20
  })

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
      renderCell: (p) => <DialogCell {...p}/>,
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
