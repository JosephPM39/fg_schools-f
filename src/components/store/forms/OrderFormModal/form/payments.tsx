import { useEffect, useState } from 'react'
import { CardBox } from '../CardBox'
import { Inputs as PaymentInputs } from '../../PaymentFormModal/form'
import { Grid, InputAdornment, TextField } from '@mui/material'
import { IPayment } from '../../../../../api/models_school'

export interface Data {
  totalCount: number
  extraPay: number
  discount: number
  payment: Omit<IPayment, 'orderId'>
}

interface PaymentsParams {
  total: number
  onChange: (d: Data) => void
}

export const Payments = ({ onChange, total }: PaymentsParams) => {
  const [data, setData] = useState<Data>({
    discount: 0,
    extraPay: 0,
    totalCount: total,
    payment: {
      details: 'Abono Inicial',
      date: new Date(),
      total: -1
    }
  })

  useEffect(() => {
    setData({
      ...data,
      totalCount: total + (data.extraPay ?? 0) - (data.discount ?? 0)
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
          value={data.totalCount ?? 0}
          onChange={(e) => e}
          InputLabelProps={{
            shrink: !isNaN(data.totalCount) && !!String(data.totalCount)
          }}
          InputProps={{
            startAdornment: <InputAdornment position='start'>$</InputAdornment>
          }}
          name="total_count"
          label="Total"
          type='number'
          inputProps={{
            max: 9999.99,
            min: 0.00,
            step: 0.01
          }}
          color='error'
          focused
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data.extraPay ?? 0}
          onChange={(e) => {
            const { value } = e.target
            setData({
              ...data,
              extraPay: parseFloat(value) || 0
            })
          }}
          InputLabelProps={{
            shrink: !isNaN(data.extraPay) && !!String(data.extraPay)
          }}
          InputProps={{
            startAdornment: <InputAdornment position='start'>$</InputAdornment>
          }}
          name="extra_pay"
          label="Costo extra"
          type='number'
          inputProps={{
            max: 9999.99,
            min: 0.00,
            step: 0.01
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data.discount ?? 0}
          onChange={(e) => {
            const { value } = e.target
            setData({
              ...data,
              discount: parseFloat(value) || 0
            })
          }}
          InputLabelProps={{
            shrink: !isNaN(data.discount) && !!String(data.discount)
          }}
          InputProps={{
            startAdornment: <InputAdornment position='start'>$</InputAdornment>
          }}
          name="discount"
          label="Descuento"
          type='number'
          inputProps={{
            max: 9999.99,
            min: 0.00,
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
            if (key === 'total') {
              return setData({
                ...data,
                payment: {
                  ...data.payment,
                  [key]: parseFloat(value || '0')
                }
              })
            }
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
