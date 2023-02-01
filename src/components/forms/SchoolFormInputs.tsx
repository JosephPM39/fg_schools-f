import { TextField, Box, IconButton, Typography, CardMedia, Grid } from "@mui/material"
import { ChangeEvent, useState } from "react"
import { ISchool } from "../../api/models_school"
import DefaultPreview from '../../assets/signature.png'

export const SchoolFormInputs = (params?: Partial<ISchool>) => {
  const [icon, setIcon] = useState<File | null>(null)

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

  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={params?.['name']}
          name="name"
          label="Nombre"
          variant="outlined"
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
          value={params?.['location']}
          name="location"
          label="Ubicación"
          variant="outlined"
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
          value={params?.['code']}
          name="code"
          label="Código"
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
            name="icon"
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
