import { Modal } from '../../../../containers/Modal'
import { Box } from '@mui/material'
import {
  BtnContainer,
  BtnPropsContainer,
  isBtnContainer,
  isNoBtnContainer,
  NoBtnContainer
} from '../../../../containers/types'
import { Dispatch, SetStateAction } from 'react'
import { IBaseModel } from '../../../../api/models_school/base.model'

interface Base<T extends IBaseModel> {
  idForUpdate?: T['id']
  onSuccess?: () => void
}

export type BaseFormModalParams<T extends IBaseModel> = Base<T> & {
  state?: [boolean, Dispatch<SetStateAction<boolean>>]
  Form: (p: Base<T>) => JSX.Element
  name: string
} & ((BtnContainer | BtnPropsContainer | NoBtnContainer) | undefined)

export const BaseFormModal = <T extends IBaseModel>(params: BaseFormModalParams<T>) => {
  const { idForUpdate, onSuccess, Form, name } = params
  const mBtn = (): BtnContainer | BtnPropsContainer | NoBtnContainer => {
    if (isNoBtnContainer(params)) {
      return {
        noButton: params.noButton
      }
    }
    if (isBtnContainer(params)) {
      return {
        btn: params.btn
      }
    }
    if (params.btnProps) {
      return {
        btnProps: params.btnProps
      }
    }
    return {
      btnProps: {
        children: `${idForUpdate ? 'Editar' : 'Agregar'} ${name}`,
        variant: 'outlined'
      }
    }
  }

  return <Modal {...mBtn()} title={`${idForUpdate ? 'Editar' : 'Agregar'} ${name}`} state={params.state}>
    <Box
      marginY={4}
      marginX={4}
    >
      <Form onSuccess={onSuccess} idForUpdate={idForUpdate}/>
    </Box>
  </Modal>
}
