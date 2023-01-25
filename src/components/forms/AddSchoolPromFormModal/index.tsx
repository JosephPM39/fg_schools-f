import { Modal, Btn, BtnProps } from '../../../containers/Modal'
import { Box } from '@mui/material';
import { Form } from './form'

export const AddSchoolPromFormModal = ({btn}:{btn?: React.ReactNode}) => {

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
