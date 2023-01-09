import { Tabs } from '../containers/Tabs';
import { Modal, Btn, BtnProps } from '../containers/Modal'
import { SchoolFormInputs } from './SchoolFormInputs';
import { FormEvent, useRef } from 'react';
import { EmployeePositionFormInputs } from './EmployeePositionFormInputs';

export const SchoolFormModal = ({btn}:{btn?: React.ReactNode}) => {

  const form = useRef<HTMLFormElement | null>(null)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (form.current) {
      const data = new FormData(form.current)
      console.log(form, 'form')
      console.log(data.get('name'), 'data')
    }
  }

  const Form = () => {
    return <>
      <form ref={form} onSubmit={onSubmit}>
        <SchoolFormInputs/>
        <EmployeePositionFormInputs/>
        <input type='submit'/>
      </form>
    </>
  }

  const list = [
    {
      label: 'De años anteriores',
      content: <>'Años anteriores'</>
    },
    {
      label: 'Nueva',
      content: <Form/>
    }
  ]
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
      <Tabs data={list} orientation='horizontal' idPrefix='sections' />
    </Modal>
  );
}
