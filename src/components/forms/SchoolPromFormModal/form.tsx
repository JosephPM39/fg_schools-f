import { SchoolFormInputs } from '../SchoolFormInputs';
import { ChangeEvent, FormEvent, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { EmployeePositionFormInputs } from '../EmployeePositionFormInputs';
import { PositionType } from '../../../api/models_school/schools/position.model';
import { Button, Divider, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { ISchoolProm } from '../../../api/models_school';
import { SelectSchoolPromYear } from '../SelectSchoolProm-Year';
import { SelectEmployeePositionPromYear } from '../SelectEmployeePosition-PromYear';
import { useEmployee } from '../../../hooks/api/schools/useEmployee';
import { useEmployeePosition } from '../../../hooks/api/schools/useEmployeePosition';
import { SchoolPromContext } from '../../../context/api/schools';
import { useSchool } from '../../../hooks/api/schools/useSchool';
import { getSubmitData, SubmitData } from './getData'
import { Alert, AlertProps, AlertWithError } from '../../Alert';
import { InvalidDataError, isInvalidDataError, promiseHandleError } from '../../../api/handlers/errors';

type SchoolOrigin = 'new' | 'previous'
type PrincipalOrigin = 'new' | 'previous' | 'all'

export const Form = (params?: { idForUpdate?: ISchoolProm['id'] }) => {
  const form = useRef<HTMLFormElement | null>(null)

  const [schoolPromForUpdate, setSchoolPromForUpdate] = useState<ISchoolProm>()

  const [schoolOrigin, setSchoolOrigin] = useState<SchoolOrigin>('new')
  const [principalOrigin, setPrincipalOrigin] = useState<PrincipalOrigin>('new')
  const [schoolSelected, setSchoolSelected] = useState<ISchoolProm>()

  const [schoolInput, setSchoolInput] = useState<ReactNode>(<>Loading</>)
  const [principalInput, setPrincipalInput] = useState<ReactNode>(<>Loading</>)

  const [isSending, setSending] = useState(false)

  const useEmployees = useEmployee()
  const useEmployeePositions = useEmployeePosition()
  const useSchools = useSchool()
  const useSchoolProms = useContext(SchoolPromContext)

  const [notify, setNotify] = useState<AlertProps | AlertWithError>()
  const [showNotify, setShowNofity] = useState(false)

  useEffect(() => {
    if (notify) setShowNofity(true)
  }, [notify])

  useEffect(() => {
    const getData = async () => {
      if (!params?.idForUpdate || !!schoolPromForUpdate) return
      const res = await useSchoolProms?.findOne({id: params.idForUpdate})
      if (!res) return
      return setSchoolPromForUpdate(res)
    }
    getData()
  }, [params, useSchoolProms?.data])

  useEffect(() => {
    if (!schoolSelected && principalOrigin === 'previous') {
      setPrincipalOrigin('new')
    }
    if (schoolOrigin === 'new' && schoolSelected) {
      setSchoolSelected(undefined)
    }
  }, [schoolSelected, principalOrigin, schoolOrigin])

  useEffect(() => {
    if (principalOrigin === 'new') {
      const input = <EmployeePositionFormInputs
        idForUpdate={schoolPromForUpdate?.principalId}
        type={PositionType.PRINCIPAL}
      />
      return setPrincipalInput(input)
    }

    const getSchoolProm = () => {
      if (principalOrigin === 'previous') {
        if (!schoolSelected) return
        return [schoolSelected]
      }
    }

    const needYearSelect = () => {
      return principalOrigin === 'all'
    }

    return setPrincipalInput(
      <SelectEmployeePositionPromYear
        proms={getSchoolProm()}
        yearSelect={needYearSelect()}
        type={PositionType.PRINCIPAL}
      />
    )
  }, [principalOrigin, schoolSelected, schoolPromForUpdate])

  useEffect(() => {
    if (schoolOrigin === 'new') {
      return setSchoolInput(<SchoolFormInputs
        idForUpdate={schoolPromForUpdate?.schoolId}
      />)
    }
    if (schoolOrigin === 'previous') {
      return setSchoolInput(<SelectSchoolPromYear onSelect={(p) => setSchoolSelected(p)}/>)
    }
  }, [schoolOrigin, schoolPromForUpdate])

  const clearForm = (e: FormEvent<HTMLFormElement>) => {
    setPrincipalOrigin('new')
    setSchoolOrigin('new')
    setSchoolSelected(undefined)
    void (e.target as HTMLFormElement).reset()
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    const data = getSubmitData({
      schoolOrigin,
      principalOrigin,
      form: form.current
    })

    if (!data || !useSchoolProms) return

    await promiseHandleError((error) => {
      console.log('Errors', error.message, (error as InvalidDataError).validationError)
      console.log(isInvalidDataError(error), 'invalid data')
      setNotify({error})
      setSending(false)
    }, async () => {
      await validateForm(data)
      await submitForm(data)
      setNotify({
        title: 'Éxito',
        details: `Escuela ${params?.idForUpdate ? 'actualizada' : 'creada'}`,
        type: 'success'
      })
      clearForm(e)
      setSending(false)
    })
  }

  const validateForm = async (data: SubmitData) => {
    if (data.school) {
      await useSchools.validate({
        data: data.school.data
      })
    }
    if (data.principal?.employee) {
      await useEmployees.validate({
        data: data.principal.employee
      })
    }
    if (data.principal) {
      const ep = {
        ...data.principal,
      }
      delete ep.employee
      await useEmployeePositions.validate({
        data: ep
      })
    }
  }

  const submitForm = async (data: SubmitData) => {

    // FOR CREATE MODE

    if (data.school && !params?.idForUpdate) {
      await useSchools.create(data.school.data)
    }
    if (data.principal?.employee && !params?.idForUpdate) {
      await useEmployees.create(data.principal.employee)
    }
    if (data.principal && !params?.idForUpdate) {
      const ep = {
        ...data.principal,
      }
      delete ep.employee
      await useEmployeePositions.create(ep)
    }

    if (!params?.idForUpdate) {
      await useSchoolProms?.create(data.schoolProm)
    }

    // FOR UPDATE MODE

    if (data.school && params?.idForUpdate) {
      await useSchools.update({
        data: data.school.data,
        id: data.school.data.id
      })
    }
    if (data.principal?.employee && params?.idForUpdate) {
      await useEmployees.update({
        data: data.principal.employee,
        id: data.principal.employee.id
      })
    }
    if (data.principal && params?.idForUpdate) {
      const ep = {
        ...data.principal,
      }
      delete ep.employee
      await useEmployeePositions.update({
        data: ep,
        id: ep.id
      })
    }
    if (params?.idForUpdate) {
      await useSchoolProms?.update({
        data: data.schoolProm,
        id: data.schoolProm.id
      })
    }
  }

  const onChangeSchoolOrigin = (e: ChangeEvent<HTMLInputElement>) => {
    setSchoolOrigin(e.target.value as SchoolOrigin)
    if (e.target.value === 'new' && principalOrigin === 'previous') {
      setPrincipalOrigin('new')
    }
  }

  const onChangePrincipalOrigin = (e: ChangeEvent<HTMLInputElement>) => {
    setPrincipalOrigin(e.target.value as PrincipalOrigin)
  }

  return <>
    <form ref={form} onSubmit={onSubmit}>
      <input
        name="school_prom_id"
        type='text'
        value={schoolPromForUpdate?.['id'] || ''}
        onChange={() => {}}
        hidden
      />
      <input
        name="year"
        type='number'
        onChange={() => {}}
        value={schoolPromForUpdate?.['year'] || ''}
        hidden
      />
      <FormLabel>Escuela: </FormLabel>
      <RadioGroup row onChange={onChangeSchoolOrigin} value={schoolOrigin}>
        <FormControlLabel
          value='new'
          control={<Radio/>}
          label={params?.idForUpdate ? 'Editar' : 'Nueva'}
        />
        <FormControlLabel
          value='previous'
          control={<Radio/>}
          label={params?.idForUpdate ? 'Cambiar por' : 'Habilitar'}
        />
      </RadioGroup>
      {schoolInput}
      <br/>
      <Divider/>
      <br/>
      <FormLabel>Director: </FormLabel>
      <RadioGroup row onChange={onChangePrincipalOrigin} value={principalOrigin}>
        <FormControlLabel
          value='new'
          control={<Radio/>}
          label={params?.idForUpdate ? 'Editar' : 'Nuevo'}
        />
        {
          (schoolOrigin === 'previous' && schoolSelected) &&
          <FormControlLabel
            value='previous'
            control={<Radio/>}
            label='Escuela seleccionada'
          />
        }
        <FormControlLabel
          value='all'
          control={<Radio/>}
          label='De otras escuelas y años'
        />
      </RadioGroup>
      {principalInput}
      <br/>
      <Button type='submit' variant='contained' disabled={isSending || showNotify}>
        {isSending ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
    <Alert
      show={showNotify}
      onClose={() => {
        setShowNofity(false)
        setNotify(undefined)
      }}
      {...notify}
    />
  </>
}
