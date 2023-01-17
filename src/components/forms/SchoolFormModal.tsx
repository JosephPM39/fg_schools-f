import { Modal, Btn, BtnProps } from '../../containers/Modal'
import { SchoolFormInputs } from './SchoolFormInputs';
import { ChangeEvent, FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { EmployeePositionFormInputs } from './EmployeePositionFormInputs';
import { PositionType } from '../../api/models_school/schools/position.model';
import { Box, Button, Divider, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { IEmployeePosition, ISchoolProm } from '../../api/models_school';
import { SelectSchool } from './SelectSchool';
import { SelectEmployeePosition } from './SelectEmployeePosition';

const Form = () => {

  const form = useRef<HTMLFormElement | null>(null)
  const [schoolOrigin, setSchoolOrigin] = useState<string>('new')
  const [principalOrigin, setPrincipalOrigin] = useState<string>('new')
  const [schoolSelected, setSchoolSelected] = useState<ISchoolProm>()
  const [epSelected, setEPSelected] = useState<Partial<IEmployeePosition>>()

  const [schoolInput, setSchoolInput] = useState<ReactNode>(<>Loading</>)
  const [principalInput, setPrincipalInput] = useState<ReactNode>(<>Loading</>)


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
      setPrincipalOrigin('new')
    }
  }

  useEffect(() => {
    if (!schoolSelected && principalOrigin === 'previous') {
      setPrincipalOrigin('new')
    }
  }, [schoolSelected, principalOrigin])

  const onChangePrincipalOrigin = (e: ChangeEvent<HTMLInputElement>) => {
    setPrincipalOrigin(e.target.value)
  }

  useEffect(() => {
    let inputs = <></>
    if (principalOrigin === 'new') {
      inputs = <EmployeePositionFormInputs type={PositionType.PRINCIPAL} />
    }
    if (principalOrigin === 'previous') {
      inputs = <SelectEmployeePosition schoolProm={schoolSelected} hook={[epSelected, setEPSelected]} type={PositionType.PRINCIPAL} />
    }
    if (principalOrigin === 'all') {
      inputs = <SelectEmployeePosition hook={[epSelected, setEPSelected]} type={PositionType.PRINCIPAL} />
    }
    setPrincipalInput(inputs)
  }, [principalOrigin, schoolSelected, epSelected])

  useEffect(() => {
    let inputs = <></>
    if (schoolOrigin === 'new') {
      inputs = <SchoolFormInputs/>
    }
    if (schoolOrigin === 'previous') {
      inputs = <SelectSchool hook={[schoolSelected, setSchoolSelected]}/>
    }
    setSchoolInput(inputs)
  }, [schoolOrigin, schoolSelected])


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
        <FormControlLabel value='all' control={<Radio/>} label='De otras escuelas' />
      </RadioGroup>
      {principalInput}
      <br/>
      <Button type='submit' variant='contained'>Guardar</Button>
    </form>
  </>
}

export const SchoolFormModal = ({btn}:{btn?: React.ReactNode}) => {

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
    <Modal fullScreen {...mBtn()} title={`Agregar escuela`}>
      <Box
        marginY={4}
        marginX={4}
      >
        <Form/>
      </Box>
    </Modal>
  );
}
