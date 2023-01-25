import { TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { IEmployeePosition, IPosition } from "../../api/models_school"
import { useEmployee } from "../../hooks/api/schools/useEmployee"
import { usePosition } from "../../hooks/api/schools/usePosition"

interface EPFIParams {
  type?: IPosition['type']
  initData?: Partial<IEmployeePosition>
}

export const EmployeePositionFormInputs = (params?: EPFIParams) => {
  const [obj, setObj] = useState<Partial<IEmployeePosition>>()
  const usePositions = usePosition()
  const useEmployees = useEmployee()
  const [positionId, setPositionId] = useState<IPosition['id'] | undefined>()

  useEffect(() => {
    if (params?.initData?.employee && params?.initData?.position && !obj) {
      setObj(params.initData)
      setPositionId(params.initData.position.id)
    }
    const getData = async () => {
      const employee = await useEmployees.findOne({ id: params?.initData?.employeeId })
      const position = await usePositions.findOne({ id: params?.initData?.positionId })
      if (params?.type) {
        await usePositions.findBy({type: params.type})
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
  }, [params, useEmployees, usePositions, obj])

  const handleChange = (event: SelectChangeEvent) => {
    setPositionId(event?.target?.value as IPosition['id'])
  }

  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={obj?.employee?.firstName}
          name="first_name"
          label="Nombre(s)"
          type='text'
          inputProps={{
            maxLength: 40,
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={obj?.employee?.lastName}
          name="last_name"
          label="Apellido(s)"
          type='text'
          inputProps={{
            maxLength: 40,
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={obj?.employee?.contact}
          name="contact"
          label="Contacto"
          type='text'
          inputProps={{
            maxLength: 55,
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={obj?.employee?.profesion}
          name="profesion"
          label="Profesión"
          type='text'
          inputProps={{
            maxLength: 10,
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <FormControl required fullWidth>
          <InputLabel id="select-position-label">Cargo</InputLabel>
          <Select
            labelId="select-position-label"
            id="select-position"
            value={positionId ?? ''}
            fullWidth
            label="Cargo"
            name="position_id"
            onChange={handleChange}
            required
          >
            <MenuItem value={''} key={`menu-item-position-null`}>
              --- Selecione el cargo ---
            </MenuItem>

            {usePositions.data.map((position, index) => (
              <MenuItem value={position.id} key={`menu-item-position-${index}`}>
                {position.name}
              </MenuItem>
            ))}

            <MenuItem value='' key={`menu-item-position-new`}>
              Nuevo
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  </>
}
