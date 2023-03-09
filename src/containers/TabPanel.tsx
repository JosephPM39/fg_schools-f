import { Box, Divider } from '@mui/material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
  orientation: 'vertical' | 'horizontal'
  idPrefix: string
  contentPadding?: number | string
}

export const TabPanel = (props: TabPanelProps) => {
  const {
    children,
    value,
    index,
    orientation,
    idPrefix,
    contentPadding = 3,
    ...other
  } = props

  return (
    <>
      <Divider/>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`${idPrefix}-${orientation}-tabpanel-${index}`}
        aria-labelledby={`${idPrefix}-${orientation}-tab-${index}`}
        style={{
          flex: 1,
          overflow: 'auto'
        }}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: contentPadding, flex: 1 }}>
            {children}
          </Box>
        )}
      </div>
    </>
  )
}
