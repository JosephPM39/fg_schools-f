import { Modal } from '../../../../containers/Modal'
import { Box } from '@mui/material';
import { Form } from './form'
import { IModel } from '../../../../api/models_school';
import {
  BtnContainer,
  BtnPropsContainer,
  isBtnContainer,
  isNoBtnContainer,
  NoBtnContainer
} from '../../../../containers/types';
import { Dispatch, SetStateAction } from 'react';
export { Form as ModelForm }

type Params = {
  idForUpdate?: IModel['id']
  state?: [boolean, Dispatch<SetStateAction<boolean>>]
} & ((BtnContainer | BtnPropsContainer | NoBtnContainer) | undefined)

export const ModelFormModal = (params: Params) => {
  const { idForUpdate } = params
  const mBtn = (): BtnContainer | BtnPropsContainer | NoBtnContainer => {
    if (isNoBtnContainer(params)) {
      return params
    }
    if (isBtnContainer(params)) {
      return params
    }
    if (params.btnProps) {
      return params
    }
    return {
      btnProps: {
        children: `${idForUpdate ? 'Editar' : 'Agregar'} modelo`,
        variant: 'outlined'
      }
    }
  }

  return <Modal {...mBtn()} title={`${idForUpdate ? 'Editar' : 'Agregar'} modelo`} state={params.state}>
    <Box
      marginY={4}
      marginX={4}
    >
      <Form idForUpdate={idForUpdate}/>
    </Box>
  </Modal>
}
