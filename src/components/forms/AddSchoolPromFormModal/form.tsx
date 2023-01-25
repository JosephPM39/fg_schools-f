import { SchoolFormInputs } from '../SchoolFormInputs';
import { ChangeEvent, FormEvent, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { EmployeePositionFormInputs } from '../EmployeePositionFormInputs';
import { PositionType } from '../../../api/models_school/schools/position.model';
import { Button, Divider, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { IEmployeePosition, ISchoolProm } from '../../../api/models_school';
import { SelectSchoolPromYear } from '../SelectSchoolProm-Year';
import { SelectEmployeePositionPromYear } from '../SelectEmployeePosition-PromYear';
import { useEmployee } from '../../../hooks/api/schools/useEmployee';
import { useEmployeePosition } from '../../../hooks/api/schools/useEmployeePosition';
import { SchoolPromContext } from '../../../context/api/schools';
import { useSchool } from '../../../hooks/api/schools/useSchool';
import { getSubmitData } from './getData'

type SchoolOrigin = 'new' | 'previous'
type PrincipalOrigin = 'new' | 'previous' | 'all'

export const Form = () => {
  const form = useRef<HTMLFormElement | null>(null)

  const [schoolOrigin, setSchoolOrigin] = useState<SchoolOrigin>('new')
  const [principalOrigin, setPrincipalOrigin] = useState<PrincipalOrigin>('new')
  const [schoolSelected, setSchoolSelected] = useState<ISchoolProm>()
  const [principalSelected, setPrincipalSelected] = useState<IEmployeePosition>()

  const [schoolInput, setSchoolInput] = useState<ReactNode>(<>Loading</>)
  const [principalInput, setPrincipalInput] = useState<ReactNode>(<>Loading</>)

  const [isSending, setSending] = useState(false)

  const useEmployees = useEmployee()
  const useEmployeePositions = useEmployeePosition()
  const useSchools = useSchool()
  const useSchoolProms = useContext(SchoolPromContext)

  useEffect(() => {
    if (!schoolSelected && principalOrigin === 'previous') {
      setPrincipalOrigin('new')
    }
    if (schoolOrigin === 'new' && schoolSelected) {
      setSchoolSelected(undefined)
    }
    if (principalOrigin === 'new' && principalSelected) {
      setPrincipalSelected(undefined)
    }
  }, [schoolSelected, principalOrigin, schoolOrigin, principalSelected])

  useEffect(() => {
    if (principalOrigin === 'new') {
      const input = <EmployeePositionFormInputs
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
        onSelect={(ep) => setPrincipalSelected(ep)}
        type={PositionType.PRINCIPAL}
      />
    )
  }, [principalOrigin, schoolSelected, principalSelected])

  useEffect(() => {
    if (schoolOrigin === 'new') {
      return setSchoolInput(<SchoolFormInputs/>)
    }
    if (schoolOrigin === 'previous') {
      return setSchoolInput(<SelectSchoolPromYear onSelect={(p) => setSchoolSelected(p)}/>)
    }
  }, [schoolOrigin])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submitAction()
  }

  const submitAction = async () => {
    setSending(true)
    const data = getSubmitData({
      schoolSelected,
      principalSelected,
      form: form.current
    })

    if (!data || !useSchoolProms) return

    if (data.school) {
      await useSchools.create({
        ...data.school.data
      })
    }

    if (data.principal?.employee) {
      await useEmployees.create(data.principal.employee)
    }

    if (data.principal) {
      const ep = {
        ...data.principal,
      }
      delete ep.employee
      await useEmployeePositions.create(ep)
    }

    await useSchoolProms.create(data.schoolProm)
    setSending(false)
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
      <FormLabel>Escuela: </FormLabel>
      <RadioGroup row onChange={onChangeSchoolOrigin} value={schoolOrigin}>
        <FormControlLabel value='new' control={<Radio/>} label='Nueva' />
        <FormControlLabel value='previous' control={<Radio/>} label='Habilitar' />
      </RadioGroup>
      {schoolInput}
      <br/>
      <Divider/>
      <br/>
      <FormLabel>Director: </FormLabel>
      <RadioGroup row onChange={onChangePrincipalOrigin} value={principalOrigin}>
        <FormControlLabel value='new' control={<Radio/>} label='Nuevo' />
        {
          (schoolOrigin === 'previous' && schoolSelected) &&
            <FormControlLabel value='previous' control={<Radio/>} label='Escuela seleccionada' />
        }
        <FormControlLabel value='all' control={<Radio/>} label='De otras escuelas y años' />
      </RadioGroup>
      {principalInput}
      <br/>
      <Button type='submit' variant='contained' disabled={isSending}>
        {isSending ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  </>
}
