import { Tabs } from '../containers/Tabs';
import { Modal, Btn, BtnProps } from '../containers/Modal'
import { SchoolFormInputs } from './SchoolFormInputs';

export const SchoolFormModal = ({btn}:{btn?: React.ReactNode}) => {

  const list = [
    {
      label: 'De años anteriores',
      content: <>'Años anteriores'</>
    },
    {
      label: 'Nueva',
      content: <SchoolFormInputs />
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
