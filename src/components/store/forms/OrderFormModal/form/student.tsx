import { Grid, TextField } from '@mui/material'
import { CardBox } from '../CardBox'
import { useEffect, useState } from 'react'

interface Data {
  firstName: string
  nickName: string
  lastName: string
}

interface StudentParams {
  onChange: (d: Data) => void
}

export const Student = ({ onChange }: StudentParams) => {
  const [data, setData] = useState<Data>({
    firstName: '',
    nickName: '',
    lastName: ''
  })

  useEffect(() => {
    onChange(data)
  }, [data])

  return < CardBox title='Datos del estudiante' >
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          value={data.firstName ?? ''}
          onChange={(e) => setData({
            ...data,
            firstName: e.target.value
          })}
          InputLabelProps={{
            shrink: !!data.firstName
          }}
          name="first_name"
          label="Nombre(s)"
          inputProps={{
            maxLength: 40,
            minLength: 1
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          value={data.lastName ?? ''}
          onChange={(e) => setData({
            ...data,
            lastName: e.target.value
          })}
          InputLabelProps={{
            shrink: !!data.lastName
          }}
          name="last_name"
          label="Apellido(s)"
          inputProps={{
            maxLength: 40,
            minLength: 1
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          value={data.nickName ?? ''}
          onChange={(e) => setData({
            ...data,
            nickName: e.target.value
          })}
          InputLabelProps={{
            shrink: !!data.nickName
          }}
          name="nick_name"
          label="Nombre para Cuadro"
          inputProps={{
            maxLength: 100,
            minLength: 1
          }}
          variant="outlined"
          required
        />
      </Grid>
    </Grid>
  </CardBox>
}
