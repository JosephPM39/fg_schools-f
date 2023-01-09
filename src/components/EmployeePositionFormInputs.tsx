import { TextField, Box, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { IEmployeePosition, IPosition } from "../api/models_school"
import { ApiContext } from "../context/ApiContext"

export const EmployeePositionFormInputs = (params?: Partial<IEmployeePosition>) => {
  const [obj, setObj] = useState<Partial<IEmployeePosition>>()
  const api = useContext(ApiContext)
  const usePosition = api?.usePosition
  const [positionId, setPositionId] = useState<IPosition['id'] | undefined>()

  useEffect(() => {
    if (params?.employee && params.position && !obj) {
      return setObj(params)
    }
    const getData = async () => {
      const employee = await api?.useEmployee.findOne({ id: params?.employeeId })
      const position = await api?.usePosition.findOne({ id: params?.positionId })
      setObj({
        employee,
        position
      })
      setPositionId(position?.id)
    }
    if (params && !obj) {
      getData()
    }
  }, [params, api?.useEmployee, api?.usePosition, obj])

  const handleChange = (event: SelectChangeEvent) => {
    setPositionId(event?.target?.value as IPosition['id'])
  }

  return <>
    <Typography>Encargado:</Typography>
    <Box
      sx={{
        '& > :not(style)': { m: 1 },
      }}
    >
      <TextField value={obj?.employee?.firstName} name="first_name" label="Nombre(s)" variant="filled" required/>
      <TextField value={obj?.employee?.lastName} name="last_name" label="Apellido(s)" variant="filled" required/>
      <TextField value={obj?.employee?.contact} name="contact" label="Contacto" variant="filled" required/>
      <TextField value={obj?.employee?.profesion} name="profesion" label="Profesión" variant="filled" required/>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Cargo</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={positionId ?? 'null'}
          label="Cargo"
          onChange={handleChange}
        >
          <MenuItem value={'null'} key={`menu-item-position-null`}>No seleccionado</MenuItem>
          {usePosition?.data?.map(
            (position, index) => <MenuItem value={position.id} key={`menu-item-position-${index}`}> {position.name} </MenuItem>
          )}
          <MenuItem value='new' key={`menu-item-position-new`}>Nuevo</MenuItem>
        </Select>
      </FormControl>
    </Box>
  </>
}
