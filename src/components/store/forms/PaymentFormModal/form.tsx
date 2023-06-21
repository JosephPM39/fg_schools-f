import { Grid, TextField } from '@mui/material'
import { IPayment } from '../../../../api/models_school'
import { getData } from './getData'
import { usePayment } from '../../../../hooks/api/store/usePayment'
import { BaseForm, InputsParams } from '../../../BaseDataTable/BaseFormModal'

export interface FormParams {
  idForUpdate?: IPayment['id']
  onSuccess?: () => void
}

const toDateTimeLocal = (date: Date) => {
  const ten = (n: number) => {
    return `${(n < 10 ? '0' : '')}${n}`
  }
  const yyyy = date.getFullYear()
  const mm = ten(date.getMonth() + 1)
  const dd = ten(date.getDate())
  const hh = ten(date.getHours())
  const ii = ten(date.getMinutes())
  const ss = ten(date.getSeconds())
  const fullDate = `${yyyy}-${mm}-${dd}`
  const fullTime = `${hh}:${ii}:${ss}`
  return `${fullDate}T${fullTime}`
}

export const Inputs = ({ data, onChange }: InputsParams<IPayment>) => {
  const date = data?.date ? new Date(data.date) : new Date()

  return (
    <>
      <input
        name="payment_id"
        type='text'
        value={data?.id ?? ''}
        onChange={() => {}}
        hidden
      />
      <input
        name="order_id"
        type='text'
        value={data?.orderId ?? ''}
        onChange={() => {}}
        hidden
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            value={data?.total ?? ''}
            onChange={(e) => onChange(e, 'total')}
            InputLabelProps={{
              shrink: !!data?.total
            }}
            name="total"
            label="Pago"
            type='number'
            inputProps={{
              max: 9999.99,
              min: 0.01,
              step: 0.01
            }}
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            value={data?.details ?? ''}
            onChange={(e) => onChange(e, 'details')}
            InputLabelProps={{
              shrink: !!data?.details
            }}
            name="details"
            label="Concepto"
            type='text'
            inputProps={{
              minLength: 1,
              maxLength: 254
            }}
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            value={toDateTimeLocal(date) ?? ''}
            onChange={(e) => onChange(e, 'date')}
            name="date"
            label="Fecha"
            type='datetime-local'
            variant="outlined"
            required
          />
        </Grid>
      </Grid>
    </>
  )
}

export const Form = (params: FormParams) => {
  const usePayments = usePayment({ initFetch: false })
  return (
    <BaseForm {...params} Inputs={Inputs} dataFormatter={getData} hook={usePayments}/>
  )
}
