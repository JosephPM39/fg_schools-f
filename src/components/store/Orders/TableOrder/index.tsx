import { Add, AttachMoney, OpenInFull, Photo } from "@mui/icons-material"
import { Button, IconButton } from "@mui/material"
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { IOrder, IStudent } from "../../../../api/models_school"
import { useStudent } from "../../../../hooks/api/store/useStudent"
import { Table } from "../../../Table"
import { getDialogCell } from "../../../Table/renders"
import { CombosByOrders, OnClickNestedParams } from "./types"
import { useGetComboPerOrders } from './useGetCombosPerOrder'

const DetailsDialogCell = getDialogCell<IOrder>({
  title: 'Detalles',
  actions: { omitCancel: true },
})

type Params = {
  list: Array<IOrder> | null
  isLoading: boolean
  onClickNested: (p: OnClickNestedParams) => void
  onPagination: (limit: number, offset: number) => void
  count: number
}

export const TableOrder = (params: Params) => {
  const useStudents = useStudent({initFetch: false})
  const { getCombosByOrders } = useGetComboPerOrders()
  const {
    onClickNested,
    list,
    onPagination,
    count,
    isLoading
  } = params

  const [open, setOpen] = useState(false)
  const [idForUpdate, setIdForUpdate] = useState<IOrder['id']>()
  const [orders, setOrders] = useState<Array<IOrder> | null>([])
  const [combosPerOrder, setCombosPerOrders] = useState<CombosByOrders>([])

  useEffect(() => {
    if (!list) return
    Promise.all(list.map(async (order) => ({
      ...order,
      student: await useStudents.findOne({id: order.studentId}) ?? undefined
    }))).then(res => {
      setOrders(res)
    })
  }, [list, useStudents.data])

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
      field: 'combo',
      headerName: 'Combo',
      type: 'string',
      valueGetter: ({row}: GridValueGetterParams<any, IOrder>) => {
        const cpo = combosPerOrder.find((cpo) => cpo.orderId === row.id)
        const combos = cpo?.combos
        if (!combos) return 'Personalizado'
        return combos.reduce((p, c) => {
          if (p.length < 1) return c.name ?? ''
          return `${p}, ${c.name}`
        }, '')
      },
      renderCell: (p) => {
        const onClick = () => {
          onClickNested({renderParams: p, field: 'combo'})
        }
        const preview = String(p.value).slice(0, 10)
        const label = preview.length < String(p.value).length ? `${preview}...` : preview

        return <Button onClick={onClick} startIcon={
          <OpenInFull/>
        }>
          {label}
        </Button>
      },
      width: 140
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
      field: 'payment',
      headerName: 'Pagos',
      type: 'actions',
      disableExport: true,
      renderCell: (p: GridRenderCellParams<any, IOrder>) => {
        const onClick = () => {
          onClickNested({renderParams: p, field: 'payment'})
        }
        return <IconButton onClick={onClick} color='primary'>
          <AttachMoney/>
        </IconButton>
      },
      width: 65
    },
    {
      field: 'photo',
      headerName: 'Fotos',
      type: 'actions',
      disableExport: true,
      renderCell: (p: GridRenderCellParams<any, IOrder>) => {
        const onClick = () => {
          onClickNested({renderParams: p, field: 'photo'})
        }
        return <IconButton onClick={onClick} color='primary'>
          <Photo/>
        </IconButton>
      },
      width: 65
    },
    {
      field: 'details',
      headerName: 'Detalles',
      valueFormatter: (p) => {
        return p.value
      },
      renderCell: (p) => <DetailsDialogCell {...p}/>,
      width: 150
    }
  ]

  return <>
    {// <OrderFormModal state={[open, setOpen]} idForUpdate={idForUpdate} noButton/>
    }
    <Table
      columns={columns}
      rows={orders ?? []}
      onPagination={onPagination}
      columnVisibilityModel={{
        lastName: false,
        firstName: false,
        remaining: false,
        total: false
      }}
      isLoading={isLoading}
      count={count}
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