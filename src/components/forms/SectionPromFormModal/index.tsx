import { Modal } from '../../../containers/Modal'
import { Box } from '@mui/material';
import { Form } from './form'
import { ISchoolProm, ISectionProm } from '../../../api/models_school';
import { BtnContainer, BtnPropsContainer } from '../../../containers/types';

interface Params {
  btn?: React.ReactNode,
  idForUpdate?: ISectionProm['id']
  schoolPromId: ISchoolProm['id']
}

export const SectionPromFormModal = (params: Params) => {
  const { btn, idForUpdate, schoolPromId } = params
  const mBtn = (): BtnContainer | BtnPropsContainer => {
    if(btn) {
      return {
        btn
      }
    }
    return {
      btnProps: {
        children: `${idForUpdate ? 'Editar' : 'Agregar'} sección`,
        variant: 'outlined'
      }
    }
  }

  return (
    <Modal {...mBtn()} title={`${idForUpdate ? 'Editar' : 'Agregar'} sección`}>
      <Box
        marginY={4}
        minWidth={500}
        minHeight={500}
        marginX={4}
      >
        <Form idForUpdate={idForUpdate} schoolPromId={schoolPromId}/>
      </Box>
    </Modal>
  );
}
