import { TextField, Grid } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { ISchool } from '../../../api/models_school'
import { useSchool } from '../../../hooks/api/schools/useSchool'

export const SchoolFormInputs = (params?: { idForUpdate?: ISchool['id'] }) => {
  const [data, setData] = useState<ISchool>()
  const useSchools = useSchool()

  useEffect(() => {
    const getData = async () => {
      if (!params?.idForUpdate || !(data == null)) return
      const res = await useSchools.findOne({ id: params.idForUpdate })
      if (res == null) return
      return setData(res)
    }
    void getData()
  }, [useSchools.data, params])

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, nam: keyof ISchool) => {
    const d = {
      ...data as ISchool,
      [nam]: e.target.value
    }
    setData(d)
  }

  return <>
    <input
      name="school_id"
      type='text'
      onChange={() => {}}
      value={data?.id ?? ''}
      hidden
    />
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data?.name ?? ''}
          onChange={(e) => onChange(e, 'name')}
          name="school_name"
          label="Nombre"
          variant="outlined"
          InputLabelProps={{
            shrink: !!data?.name
          }}
          inputProps={{
            minLength: 1,
            maxLength: 100
          }}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data?.location ?? ''}
          onChange={(e) => onChange(e, 'location')}
          name="school_location"
          label="Dirección"
          variant="outlined"
          InputLabelProps={{
            shrink: !!data?.location
          }}
          inputProps={{
            minLength: 1,
            maxLength: 254
          }}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data?.code ?? ''}
          onChange={(e) => onChange(e, 'code')}
          name="school_code"
          label="Código"
          InputLabelProps={{
            shrink: !!data?.code
          }}
          inputProps={{
            minLength: 1,
            maxLength: 30
          }}
          variant="outlined"
          required
        />
      </Grid>
    </Grid>
  </>
}
