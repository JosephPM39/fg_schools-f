import { Modal } from '../../../../containers/Modal'
import { Box } from '@mui/material';
import {
  BtnContainer,
  BtnPropsContainer,
  isBtnContainer,
  isNoBtnContainer,
  NoBtnContainer
} from '../../../../containers/types';
import { Dispatch, SetStateAction } from 'react';
import { IBaseModel } from '../../../../api/models_school/base.model';

interface Base<T extends IBaseModel> {
  idForUpdate?: T['id']
  onSuccess?: () => void
}

export type BaseFormModalParams<T extends IBaseModel> = {
  state?: [boolean, Dispatch<SetStateAction<boolean>>]
  Form: (p: Base<T>) => JSX.Element
} & ((BtnContainer | BtnPropsContainer | NoBtnContainer) | undefined) & Base<T>

export const BaseFormModal = <T extends IBaseModel>(params: BaseFormModalParams<T>) => {
  const { idForUpdate, onSuccess, Form } = params
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
        children: `${idForUpdate ? 'Editar' : 'Agregar'} color`,
        variant: 'outlined'
      }
    }
  }

  return <Modal {...mBtn()} title={`${idForUpdate ? 'Editar' : 'Agregar'} color`} state={params.state}>
    <Box
      marginY={4}
      marginX={4}
    >
      <Form onSuccess={onSuccess} idForUpdate={idForUpdate}/>
    </Box>
  </Modal>
}
