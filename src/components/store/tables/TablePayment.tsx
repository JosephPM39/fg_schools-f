import { Add } from '@mui/icons-material'
import { Button } from '@mui/material'
import { GridColDef, GridValueFormatterParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { IOrder, IPayment } from '../../../api/models_school'
import { usePayment } from '../../../hooks/api/store/usePayment'
import { Table } from '../../Table'
import { getDialogCell } from '../../Table/renders'

interface Params {
  orderId: IOrder['id']
}

const ExpandableCell = getDialogCell({
  title: 'Concepto'
})

export const TablePayment = (params: Params) => {
  const { orderId } = params
  const [payments, setPayments] = useState<IPayment[] | null>()
  const [isLoading, setIsLoading] = useState(true)
  // const [idForUpdate, setIdForUpdate] = useState<IPayment['id']>()
  // const [open, setOpen] = useState(false)
  const usePayments = usePayment({ initFetch: false })

  const columns: GridColDef[] = [
    {
      field: 'total',
      headerName: 'Cantidad',
      valueFormatter: ({ value }: GridValueFormatterParams<string>) => {
        return `$${value}`
      }
    },
    {
      field: 'date',
      headerName: 'Fecha',
      valueFormatter: ({ value }) => new Date(value),
      type: 'date'
    },
    {
      field: 'details',
      headerName: 'Concepto',
      renderCell: (p) => <ExpandableCell {...p}/>,
      valueFormatter: ({ value }) => value
    }
  ]

  useEffect(() => {
    void usePayments.fetch({ searchBy: { orderId } }).then((res) => {
      setPayments(res.data)
    })
  }, [orderId])

  useEffect(() => {
    if (payments === null) return setIsLoading(false)
    if (payments === undefined) return
    const loading = payments.length < 1 || usePayments.needFetchNext
    setIsLoading(loading)
  }, [payments, usePayments.needFetchNext])

  /* useEffect(() => {
    if (idForUpdate) {
      setOpen(true)
    }
  }, [idForUpdate]) */

  return <>
    {
      // <OrderFormModal state={[open, setOpen]} idForUpdate={idForUpdate} noButton/>
    }
    <Table
      columns={columns}
      rows={usePayments.data ?? []}
      onPagination={(limit, offset) => {
        usePayments.launchNextFetch({ limit, offset })
      }}
      isLoading={isLoading}
      count={usePayments.metadata?.count ?? 0}
      name="Bordes de productos"
      deleteAction={(id) => console.log(id)}
      editAction={(id) => console.log(id)}
      toolbar={{
        add: <Button startIcon={<Add/>} onClick={() => {
          // setIdForUpdate(undefined)
          // setOpen(true)
        }}>
          Nuevo
        </Button>
      }}
    />
  </>
}
