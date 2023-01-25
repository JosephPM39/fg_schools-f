import { SchoolFormInputs } from '../SchoolFormInputs';
import { ChangeEvent, FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { EmployeePositionFormInputs } from '../EmployeePositionFormInputs';
import { PositionType } from '../../../api/models_school/schools/position.model';
import { Button, Divider, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { IEmployeePosition, ISchool, ISchoolProm } from '../../../api/models_school';
import { SelectSchoolPromYear } from '../SelectSchoolProm-Year';
import { SelectEmployeePositionPromYear } from '../SelectEmployeePosition-PromYear';

type SchoolOrigin = 'new' | 'previous'
type PrincipalOrigin = 'new' | 'previous' | 'all'

export const Form = () => {

  const form = useRef<HTMLFormElement | null>(null)
  const [schoolOrigin, setSchoolOrigin] = useState<SchoolOrigin>('new')
  const [principalOrigin, setPrincipalOrigin] = useState<PrincipalOrigin>('new')
  const [schoolSelected, setSchoolSelected] = useState<ISchoolProm>()
  const [epSelected, setEPSelected] = useState<Partial<IEmployeePosition>>()

  const [schoolInput, setSchoolInput] = useState<ReactNode>(<>Loading</>)
  const [principalInput, setPrincipalInput] = useState<ReactNode>(<>Loading</>)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let schoolData: Partial<ISchool> | undefined
    let principal: Partial<IEmployeePosition> | undefined
    if (!form.current) return
    const formData = new FormData(form.current)

    const icon = formData.get('icon') as File | null
    const name = formData.get('name') as string ?? undefined
    const location = formData.get('location') as string ?? undefined
    const code = formData.get('code') as string ?? undefined

    schoolData = {
      icon: icon?.name || 'default',
      name,
      location,
      code
    }

    const firstName = formData.get('first_name') as string
    const lastName = formData.get('last_name') as string
    const contact = formData.get('contact') as string
    const profesion = formData.get('profesion') as string
    const positionId = formData.get('position_id') as string

    principal = {
      employee: {
        firstName,
        lastName,
        contact,
        profesion
      },
      positionId
    }

    console.log(form, 'form')

    if (schoolOrigin === 'new') {
      console.log(schoolData, 'data')
    }

    console.log(principal,'data')

    if (schoolOrigin === 'previous') {
      console.log(schoolSelected, 'previous school')
    }
  }

  const onChangeSchoolOrigin = (e: ChangeEvent<HTMLInputElement>) => {
    setSchoolOrigin(e.target.value as SchoolOrigin)
    if (e.target.value === 'new' && principalOrigin === 'previous') {
      setPrincipalOrigin('new')
    }
  }

  useEffect(() => {
    if (!schoolSelected && principalOrigin === 'previous') {
      setPrincipalOrigin('new')
    }
  }, [schoolSelected, principalOrigin])

  const onChangePrincipalOrigin = (e: ChangeEvent<HTMLInputElement>) => {
    setPrincipalOrigin(e.target.value as PrincipalOrigin)
  }

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
        onSelect={(ep) => setEPSelected(ep)}
        type={PositionType.PRINCIPAL}
      />
    )
  }, [principalOrigin, schoolSelected, epSelected])

  useEffect(() => {
    if (schoolOrigin === 'new') {
      return setSchoolInput(<SchoolFormInputs/>)
    }
    if (schoolOrigin === 'previous') {
      return setSchoolInput(<SelectSchoolPromYear onSelect={(p) => setSchoolSelected(p)}/>)
    }
  }, [schoolOrigin])


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
      <Button type='submit' variant='contained'>Guardar</Button>
    </form>
  </>
}
