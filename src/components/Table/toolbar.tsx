import { ReactNode } from 'react'
import {
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  GridPrintExportMenuItem
} from '@mui/x-data-grid'
import { PDFExport } from './exporters'

interface Params {
  name: string
  actions?: {
    other?: ReactNode
  }
}
export const Toolbar = (params: Params) => {
  const { name, actions } = params
  return (
    <GridToolbarContainer>
      <GridToolbarDensitySelector/>
      <GridToolbarColumnsButton/>
      <GridToolbarFilterButton/>
      <GridToolbarExportContainer>
        <GridCsvExportMenuItem options={{
          fileName: name,
          utf8WithBom: true
        }} />
        <PDFExport options={{
          filename: name
        }}/>
        <GridPrintExportMenuItem options={{
          hideFooter: true,
          fileName: name,
          hideToolbar: true
        }}/>
      </GridToolbarExportContainer>
      {actions?.other}
    </GridToolbarContainer>
  )
}
