import { Box } from '@mui/material'
import { Modal } from '../containers/Modal'
import { Tabs } from '../containers/Tabs'
import { BtnContainer, BtnPropsContainer } from '../containers/types'
import { ProductsTabs } from './product/ProductsTabs'

interface Params {
  btn?: React.ReactNode
}

export const SettingsModal = ({ btn }: Params) => {
  const data = [
    {
      label: 'Artículos',
      content: <ProductsTabs/>
    },
    {
      label: 'Combos',
      content: <Box sx={{ p: 3 }}>Put here combos components</Box>
    }
  ]

  const mBtn = (): BtnContainer | BtnPropsContainer => {
    if (btn) {
      return {
        btn
      }
    }
    return {
      btnProps: {
        children: 'Ajustes',
        variant: 'outlined'
      }
    }
  }

  return (
    <Modal fullScreen {...mBtn()} title={'Ajustes'}>
      <Tabs data={data} orientation='horizontal' contentPadding={0} idPrefix="settings" />
    </Modal>
  )
}
