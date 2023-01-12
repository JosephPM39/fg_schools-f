import { Modal, Btn, BtnProps } from '../../containers/Modal'
import { SchoolFormInputs } from './SchoolFormInputs';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { EmployeePositionFormInputs } from './EmployeePositionFormInputs';
import { PositionType } from '../../api/models_school/schools/position.model';
import { Box, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

export const SchoolFormModal = ({btn}:{btn?: React.ReactNode}) => {

  const form = useRef<HTMLFormElement | null>(null)
  const [schoolOrigin, setSchoolOrigin] = useState<string>('new')
  const [principalOrigin, setPrincipalOrigin] = useState<string>('new')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (form.current) {
      const data = new FormData(form.current)
      console.log(form, 'form')
      console.log(data.get('name'), 'data')
    }
  }

  const onChangeSchoolOrigin = (e: ChangeEvent<HTMLInputElement>) => {
    setSchoolOrigin(e.target.value)
    if (e.target.value === 'new' && principalOrigin === 'previous') {
      console.log('principal', principalOrigin)
      setPrincipalOrigin('new')
    }
  }

  const onChangePrincipalOrigin = (e: ChangeEvent<HTMLInputElement>) => {
    setPrincipalOrigin(e.target.value)
  }

  const SchoolData = () => {
    if (schoolOrigin === 'new') {
      return <SchoolFormInputs/>
    }
    return <>Seleccion una vieja xd</>
  }

  const PrincipalData = () => {
    if (principalOrigin === 'new') {
      return <EmployeePositionFormInputs type={PositionType.PRINCIPAL} />
    }
    if (principalOrigin === 'previous') {
      return <>Seleccione al viejo xd</>
    }
    return <>Seleccione a otor viejo xd</>
  }

  const Form = () => {
    return <>
      <form ref={form} onSubmit={onSubmit}>
        <FormLabel>Escuela</FormLabel>
        <RadioGroup row onChange={onChangeSchoolOrigin} defaultValue={schoolOrigin}>
          <FormControlLabel value='new' control={<Radio/>} label='Nueva' />
          <FormControlLabel value='previous' control={<Radio/>} label='Habilitar' />
        </RadioGroup>
        <SchoolData/>
        <FormLabel>Director</FormLabel>
        <RadioGroup row onChange={onChangePrincipalOrigin} defaultValue={principalOrigin}>
          <FormControlLabel value='new' control={<Radio/>} label='Nuevo' />
          {
            schoolOrigin === 'previous' &&
            <FormControlLabel value='previous' control={<Radio/>} label='Años anteriores' />
          }
          <FormControlLabel value='all' control={<Radio/>} label='De otras instituciones' />
        </RadioGroup>
        <PrincipalData/>
        <input type='submit'/>
      </form>
    </>
  }

  const mBtn = (): Btn | BtnProps => {
    if(btn) {
      return {
        btn
      }
    }
    return {
      btnProps: {
        children: 'Agregar escuela',
        variant: 'outlined'
      }
    }
  }

  return (
    <Modal {...mBtn()} title={`Agregar escuela`}>
      <Box
        marginY={4}
        marginX={4}
      >
        <Form/>
      </Box>
    </Modal>
  );
}
