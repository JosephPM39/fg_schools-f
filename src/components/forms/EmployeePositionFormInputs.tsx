import { TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Grid } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { IEmployeePosition, IPosition } from "../../api/models_school"
import { ApiContext } from "../../context/ApiContext"

interface EPFIParams {
  type?: IPosition['type']
  initData?: Partial<IEmployeePosition>
}

export const EmployeePositionFormInputs = (params?: EPFIParams) => {
  const [obj, setObj] = useState<Partial<IEmployeePosition>>()
  const usePosition = useContext(ApiContext)?.usePosition
  const useEmployee = useContext(ApiContext)?.useEmployee
  const [positionId, setPositionId] = useState<IPosition['id'] | undefined>()
  const [positions, setPositions] = useState<Array<IPosition> | undefined>([])

  useEffect(() => {
    if (params?.initData?.employee && params?.initData?.position && !obj) {
      setObj(params.initData)
      setPositionId(params.initData.position.id)
    }
    const getData = async () => {
      const employee = await useEmployee?.findOne({ id: params?.initData?.employeeId })
      const position = await usePosition?.findOne({ id: params?.initData?.positionId })
      if (params?.type) {
        setPositions(await usePosition?.findBy({type: params.type}))
      }
      if (!params?.type) {
        setPositions(usePosition?.data)
      }
      setObj({
        employee,
        position
      })
      setPositionId(position?.id)
    }
    if (params && !obj) {
      getData()
    }
  }, [params, useEmployee, usePosition, obj])

  const handleChange = (event: SelectChangeEvent) => {
    setPositionId(event?.target?.value as IPosition['id'])
  }

  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth value={obj?.employee?.firstName} name="first_name" label="Nombre(s)" variant="outlined" required/>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth value={obj?.employee?.lastName} name="last_name" label="Apellido(s)" variant="outlined" required/>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth value={obj?.employee?.contact} name="contact" label="Contacto" variant="outlined" required/>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth value={obj?.employee?.profesion} name="profesion" label="Profesión" variant="outlined" required/>
      </Grid>
      <Grid item xs={12} sm={12}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Cargo</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={positionId ?? 'null'}
            fullWidth
            label="Cargo"
            onChange={handleChange}
          >
            <MenuItem value={'null'} key={`menu-item-position-null`}>No seleccionado</MenuItem>
            {positions?.map(
              (position, index) => <MenuItem value={position.id} key={`menu-item-position-${index}`}> {position.name} </MenuItem>
            )}
            <MenuItem value='new' key={`menu-item-position-new`}>Nuevo</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  </>
}
