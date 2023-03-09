import { FormModalParams } from '../forms/PaymentFormModal'
import { FormParams, Inputs } from '../forms/PaymentFormModal/form'
import { getData } from '../forms/PaymentFormModal/getData'
import { BaseTable } from './../../BaseDataTable/BaseTable'
import { GridColDef, GridValueFormatterParams } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { IOrder } from '../../../api/models_school'
import { usePayment } from '../../../hooks/api/store/usePayment'
import { getDialogCell, getOverflowCell } from '../../Table/renders'
import { BaseForm, BaseFormModal } from '../../BaseDataTable/BaseFormModal'

interface Params {
  orderId: IOrder['id']
  studentName: string
}

const ExpandableCell = getDialogCell({
  title: 'Concepto'
})

export const TablePayment = (params: Params) => {
  const usePayments = usePayment({ initFetch: false })
  const { orderId, studentName } = params

  const Form = (params: FormParams) => {
    const getPayment = (...p: Parameters<typeof getData>) => {
      const data = getData(...p)
      return {
        ...data,
        orderId
      }
    }

    return (
      <BaseForm {...params} Inputs={Inputs} dataFormatter={getPayment} hook={usePayments}/>
    )
  }

  const FormModal = (params: FormModalParams) => {
    return (
      <BaseFormModal {...params as any} Form={Form} name='Pago'/>
    )
  }

  const dateFormat = (value: string) => {
    const date = new Date(value)
    console.log(date)
    const formated = date.toLocaleString('es-GB', {
      hourCycle: 'h12',
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'America/El_Salvador'
    })
    console.log(formated)
    return formated
  }

  const OverflowCell = getOverflowCell({
    valueGetter: ({ value }) => dateFormat(value)
  })

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
      valueFormatter: ({ value }) => {
        return dateFormat(value)
      },
      renderCell: (p) => <OverflowCell {...p}/>,
      type: 'date',
      flex: 1
    },
    {
      field: 'details',
      headerName: 'Concepto',
      renderCell: (p) => <ExpandableCell {...p}/>,
      valueFormatter: ({ value }) => value,
      flex: 1
    }
  ]

  useEffect(() => {
    void usePayments.fetch({ searchBy: { orderId } })
  }, [orderId])

  return <BaseTable
    FormModal={FormModal}
    hook={usePayments}
    name={`Pagos de: ${studentName}`}
    columns={columns}
  />
}
