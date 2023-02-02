import { TextField, Box, IconButton, Typography, CardMedia, Grid } from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react"
import { ISchool } from "../../api/models_school"
import DefaultPreview from '../../assets/signature.png'
import { useSchool } from "../../hooks/api/schools/useSchool"

export const SchoolFormInputs = (params?: { idForUpdate?: ISchool['id']}) => {
  const [icon, setIcon] = useState<File | null>(null)
  const [data, setData] = useState<ISchool>()
  const useSchools = useSchool()

  useEffect(() => {
    const getData = async () => {
      if (!params?.idForUpdate || !!data) return
      const res = await useSchools.findOne({id: params.idForUpdate})
      if (!res) return
      return setData(res)
    }
    getData()
  }, [useSchools.data, params])
  /*
  useEffect(() => {
    const getData = async () => {
      if (!data?.icon || !data) return
      const i = await fetch(data.icon)
      const res = await i.blob()

      setIcon(new File([res], 'icon'))
    }
  }, [data])
*/
  const onSelectIcon = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      return setIcon(e.target.files[0])
    }
  }

  const getPreview = () => {
    if (!!icon) {
      return URL.createObjectURL(icon)
    }
    return DefaultPreview
  }

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, nam: keyof ISchool) => {
    const d = {
      ...data,
      [nam]: e.target.value
    } as ISchool
    setData(d)
  }

  return <>
    <input
      name="school_id"
      type='text'
      onChange={() => {}}
      value={data?.['id'] || ''}
      hidden
    />
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data?.['name'] || ''}
          onChange={(e) => onChange(e, 'name')}
          name="school_name"
          label="Nombre"
          variant="outlined"
          InputLabelProps={{
            shrink: !!data?.['name']
          }}
          inputProps={{
            minLength: 1,
            maxLength: 100,
          }}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data?.['location'] || ''}
          onChange={(e) => onChange(e, 'location')}
          name="school_location"
          label="Dirección"
          variant="outlined"
          InputLabelProps={{
            shrink: !!data?.['location']
          }}
          inputProps={{
            minLength: 1,
            maxLength: 254,
          }}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data?.['code'] || ''}
          onChange={(e) => onChange(e, 'code')}
          name="school_code"
          label="Código"
          InputLabelProps={{
            shrink: !!data?.['code']
          }}
          inputProps={{
            minLength: 1,
            maxLength: 30,
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <IconButton component="label" >
          <input
            hidden
            accept="image/*"
            type="file"
            name="school_icon"
            onChange={onSelectIcon}
          />
          <Box display='flex' alignItems='center' >
            <Typography>Logo:</Typography>
            <CardMedia
              component="img"
              alt={icon?.name}
              height="40"
              image={getPreview()}
            />
          </Box>
        </IconButton>
      </Grid>
    </Grid>
  </>
}
