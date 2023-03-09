import { Modal } from '../../../../containers/Modal'
import { Box } from '@mui/material'
import { Form } from './form'
import { ISchoolProm } from '../../../../api/models_school'
import { BtnContainer, BtnPropsContainer } from '../../../../containers/types'

export const SchoolPromFormModal = ({ btn, idForUpdate }: { btn?: React.ReactNode, idForUpdate?: ISchoolProm['id'] }) => {
  const mBtn = (): BtnContainer | BtnPropsContainer => {
    if (btn) {
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
  )
}
