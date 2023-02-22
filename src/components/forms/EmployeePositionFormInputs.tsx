import { TextField, Grid } from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react"
import { IEmployee, IEmployeePosition, IPosition } from "../../api/models_school"
import { useEmployee } from "../../hooks/api/schools/useEmployee"
import { useEmployeePosition } from "../../hooks/api/schools/useEmployeePosition"
import { usePosition } from "../../hooks/api/schools/usePosition"
import { v4 as uuidV4 } from 'uuid'
import { SelectPosition } from "./SelectPosition"

interface EPFIParams {
  type?: IPosition['type']
  idForUpdate?: IEmployeePosition['id']
}

export const EmployeePositionFormInputs = (params?: EPFIParams) => {
  const [obj, setObj] = useState<Partial<IEmployeePosition>>()
  const useEmployeePositions = useEmployeePosition()
  const usePositions = usePosition({ initFetch: false })
  const useEmployees = useEmployee()
  const [positionId, setPositionId] = useState<IPosition['id'] | undefined>()

  useEffect(() => {
    const getData = async () => {
      const ep = await useEmployeePositions.findOne({ id: params?.idForUpdate})
      const employee = await useEmployees.findOne({ id: ep?.employeeId })
      const position = await usePositions.findOne({ id: ep?.positionId })
      if (params?.type) {
        await usePositions.findBy({type: params.type})
      }
      setObj({
        ...ep,
        employee,
        position
      })
      setPositionId(position?.id)
    }
    if (params && !obj) {
      getData()
    }
  }, [params, useEmployees, usePositions, obj, useEmployeePositions])

  const handleChange = (p?: IPosition) => {
    setPositionId(p?.id)
  }

  const onTxtChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, nam: keyof IEmployee) => {
    const d = {
      ...obj,
      employee: {
        ...obj?.employee,
        [nam]: e.target.value
      }
    } as IEmployeePosition
    setObj(d)
  }

  return <>
    <input
      name="employee_position_id"
      type='text'
      onChange={() => {}}
      value={obj?.id || uuidV4()}
      hidden
    />
    <input
      name="employee_id"
      type='text'
      onChange={() => {}}
      value={obj?.employeeId || ''}
      hidden
    />
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={obj?.employee?.firstName || ''}
          InputLabelProps={{
            shrink: !!obj?.employee?.firstName
          }}
          name="employee_first_name"
          label="Nombre(s)"
          type='text'
          onChange={(e) => onTxtChange(e, 'firstName')}
          inputProps={{
            minLength: 1,
            maxLength: 40,
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={obj?.employee?.lastName || ''}
          onChange={(e) => onTxtChange(e, 'lastName')}
          InputLabelProps={{
            shrink: !!obj?.employee?.lastName
          }}
          name="employee_last_name"
          label="Apellido(s)"
          type='text'
          inputProps={{
            minLength: 1,
            maxLength: 40,
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={obj?.employee?.contact || ''}
          onChange={(e) => onTxtChange(e, 'contact')}
          InputLabelProps={{
            shrink: !!obj?.employee?.contact
          }}
          name="employee_contact"
          label="Contacto"
          type='text'
          inputProps={{
            minLength: 1,
            maxLength: 55,
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={obj?.employee?.profesion || ''}
          onChange={(e) => onTxtChange(e, 'profesion')}
          InputLabelProps={{
            shrink: !!obj?.employee?.profesion
          }}
          name="employee_profesion"
          label="Profesión"
          type='text'
          inputProps={{
            minLength: 1,
            maxLength: 10,
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <SelectPosition
          defaultValue={positionId}
          list={usePositions.data}
          onSelect={handleChange}
          count={usePositions.metadata?.count ?? 0}
          paginationNext={() => usePositions.setNeedFetchNext(true)}
        />
      </Grid>
    </Grid>
  </>
}
