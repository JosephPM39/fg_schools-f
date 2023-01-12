import { TextField, Box, IconButton, Typography, CardMedia } from "@mui/material"
import { ChangeEvent, useState } from "react"
import { ISchool } from "../../api/models_school"
import DefaultPreview from '../../assets/signature.png'

export const SchoolFormInputs = (params?: Partial<ISchool>) => {
  const [icon, setIcon] = useState<File | null>(null)
  console.log('change, ', icon)

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
    <Box
      sx={{
        '& > :not(style)': { m: 1 },
      }}
    >
      <TextField value={params?.['name']} name="name" label="Nombre" variant="outlined" required/>
      <TextField value={params?.['location']} name="location" label="Ubicación" variant="outlined" required/>
      <TextField value={params?.['code']} name="code" label="Código" variant="outlined" required/>
      <IconButton component="label" >
        <input hidden accept="image/*" type="file" name="icon" onChange={onSelectIcon}/>
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
    </Box>
  </>
}
