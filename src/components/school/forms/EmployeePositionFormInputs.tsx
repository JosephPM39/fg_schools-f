import { TextField, Grid } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { IEmployee, IEmployeePosition, IPosition } from '../../../api/models_school'
import { useEmployee } from '../../../hooks/api/schools/useEmployee'
import { useEmployeePosition } from '../../../hooks/api/schools/useEmployeePosition'
import { usePosition } from '../../../hooks/api/schools/usePosition'
import { SelectPosition } from './SelectPosition'

interface EPFIParams {
  type?: IPosition['type']
  idForUpdate?: IEmployeePosition['id']
}

export const EmployeePositionFormInputs = (params: EPFIParams) => {
  const {
    idForUpdate,
    type
  } = params
  const [position, setPosition] = useState<IPosition>()
  const [employeePosition, setEmployeePosition] = useState<IEmployeePosition>()
  const useEmployeePositions = useEmployeePosition()
  const usePositions = usePosition({ initFetch: false })
  const useEmployees = useEmployee()

  useEffect(() => {
    if (!type) {
      void usePositions.fetch({})
      return
    }
    void usePositions.fetch({ searchBy: { type } })
  }, [type])

  useEffect(() => {
    const getData = async () => {
      if (!idForUpdate) return
      const employeePosition = await useEmployeePositions.findOne({ id: idForUpdate })
      if (!employeePosition) return
      const employee = await useEmployees.findOne({ id: employeePosition.employeeId }) ?? undefined
      const position = await usePositions.findOne({ id: employeePosition.positionId }) ?? undefined
      const ep: IEmployeePosition = {
        ...employeePosition,
        employee,
        position
      }
      setPosition(position)
      setEmployeePosition(ep ?? undefined)
    }
    void getData()
  }, [idForUpdate])

  /* const handleChange = (p?: IPosition) => {
    setPositionId(p?.id)
  } */

  const onTxtChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, nam: keyof IEmployee) => {
    const d = {
      ...employeePosition as IEmployeePosition,
      employee: {
        ...employeePosition?.employee as IEmployee,
        [nam]: e.target.value
      }
    }
    setEmployeePosition(d)
  }

  return <>
    <input
      name="employee_position_id"
      type='text'
      value={employeePosition?.id ?? ''}
      onChange={() => {}}
      hidden
    />
    <input
      name="employee_id"
      type='text'
      value={employeePosition?.employeeId ?? ''}
      onChange={() => {}}
      hidden
    />
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={employeePosition?.employee?.firstName ?? ''}
          InputLabelProps={{
            shrink: !!employeePosition?.employee?.firstName
          }}
          name="employee_first_name"
          label="Nombre(s)"
          type='text'
          onChange={(e) => onTxtChange(e, 'firstName')}
          inputProps={{
            minLength: 1,
            maxLength: 40
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={employeePosition?.employee?.lastName ?? ''}
          onChange={(e) => onTxtChange(e, 'lastName')}
          InputLabelProps={{
            shrink: !!employeePosition?.employee?.lastName
          }}
          name="employee_last_name"
          label="Apellido(s)"
          type='text'
          inputProps={{
            minLength: 1,
            maxLength: 40
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={employeePosition?.employee?.contact ?? ''}
          onChange={(e) => onTxtChange(e, 'contact')}
          InputLabelProps={{
            shrink: !!employeePosition?.employee?.contact
          }}
          name="employee_contact"
          label="Contacto"
          type='text'
          inputProps={{
            minLength: 1,
            maxLength: 55
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={employeePosition?.employee?.profesion ?? ''}
          onChange={(e) => onTxtChange(e, 'profesion')}
          InputLabelProps={{
            shrink: !!employeePosition?.employee?.profesion
          }}
          name="employee_profesion"
          label="Profesión"
          type='text'
          inputProps={{
            minLength: 1,
            maxLength: 10
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <SelectPosition
          required
          defaultValue={position?.id}
          hook={usePositions}
        />
      </Grid>
    </Grid>
  </>
}
