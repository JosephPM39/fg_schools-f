import { Modal, Btn, BtnProps } from '../../../containers/Modal'
import { Box } from '@mui/material';
import { Form } from './form'
import { ISchoolProm } from '../../../api/models_school';

export const SchoolPromFormModal = ({btn, idForUpdate}:{btn?: React.ReactNode, idForUpdate?: ISchoolProm['id']}) => {
  const mBtn = (): Btn | BtnProps => {
    if(btn) {
      return {
        btn
      }
    }
    return {
      btnProps: {
        children: `${idForUpdate ? 'Editar' : 'Agregar'} escuela`,
        variant: 'outlined'
      }
    }
  }

  return (
    <Modal fullScreen {...mBtn()} title={`${idForUpdate ? 'Editar' : 'Agregar'} escuela`}>
      <Box
        marginY={4}
        marginX={4}
      >
        <Form idForUpdate={idForUpdate}/>
      </Box>
    </Modal>
  );
}
