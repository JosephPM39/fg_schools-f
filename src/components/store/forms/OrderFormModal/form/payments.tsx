import { useEffect, useState } from 'react'
import { CardBox } from '../CardBox'
import { Inputs as PaymentInputs } from '../../PaymentFormModal/form'
import { Grid, TextField } from '@mui/material'
import { IPayment } from '../../../../../api/models_school'

interface Data {
  totalCount: number
  extraPay: number
  discount: number
  payment: Partial<IPayment>
}

interface PaymentsParams {
  total: number
  onChange: (d: Data) => void
}

export const Payments = ({ onChange, total }: PaymentsParams) => {
  const [data, setData] = useState<Data>({
    discount: NaN,
    extraPay: NaN,
    totalCount: total,
    payment: {
      details: '',
      date: new Date(),
      total: NaN
    }
  })

  useEffect(() => {
    if (isNaN(data.extraPay)) return
    if (isNaN(data.discount)) return
    if (isNaN(total)) return
    setData({
      ...data,
      totalCount: total + data.extraPay - data.discount
    })
  }, [total, data.extraPay, data.discount])

  useEffect(() => {
    onChange(data)
  }, [data])

  return <CardBox title='Pago'>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          value={data.totalCount ?? ''}
          onChange={(e) => e}
          InputLabelProps={{
            shrink: !isNaN(data.totalCount) && !!String(data.totalCount)
          }}
          name="total_count"
          label="Total"
          type='number'
          inputProps={{
            max: 9999.99,
            min: 0.01,
            step: 0.01
          }}
          disabled
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data.extraPay ?? ''}
          onChange={(e) => {
            const { value } = e.target
            setData({
              ...data,
              extraPay: parseFloat(value)
            })
          }}
          InputLabelProps={{
            shrink: !isNaN(data.extraPay) && !!String(data.extraPay)
          }}
          name="extra_pay"
          label="Costo extra"
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
          value={data.discount ?? ''}
          onChange={(e) => {
            const { value } = e.target
            setData({
              ...data,
              discount: parseFloat(value)
            })
          }}
          InputLabelProps={{
            shrink: !isNaN(data.discount) && !!String(data.discount)
          }}
          name="discount"
          label="Descuento"
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
      <Grid item xs={12} sm={12}>
        <PaymentInputs
          data={data.payment}
          onChange={(e, key) => {
            const { value } = e.target
            setData({
              ...data,
              payment: {
                ...data.payment,
                [key]: value
              }
            })
          }} />
      </Grid>
    </Grid>
  </CardBox>
}
