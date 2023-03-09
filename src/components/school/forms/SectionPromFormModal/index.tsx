import { Modal } from '../../../../containers/Modal'
import { Box } from '@mui/material'
import { Form } from './form'
import { ISchool, ISectionProm } from '../../../../api/models_school'
import { BtnContainer, BtnPropsContainer } from '../../../../containers/types'

interface Params {
  btn?: React.ReactNode
  idForUpdate?: ISectionProm['id']
  schoolId: ISchool['id']
}

export const SectionPromFormModal = (params: Params) => {
  const { btn, idForUpdate, schoolId } = params
  const mBtn = (): BtnContainer | BtnPropsContainer => {
    if (btn) {
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
    <Modal fullScreen {...mBtn()} title={`${idForUpdate ? 'Editar' : 'Agregar'} sección`}>
      <Box
        marginY={4}
        marginX={4}
      >
        <Form idForUpdate={idForUpdate} schoolId={schoolId}/>
      </Box>
    </Modal>
  )
}
