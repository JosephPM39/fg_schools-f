import { GridColDef } from '@mui/x-data-grid'
import { useSize } from '../../../hooks/api/products/useSize'
import { SizeFormModal } from '../forms/SizeFormModal'
import { BaseTable } from './../../BaseDataTable/BaseTable'

export const TableSize = () => {
  const useSizes = useSize()

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      type: 'string',
      disableExport: true,
      flex: 1
    },
    {
      field: 'name',
      headerName: 'Nombre',
      type: 'string',
      flex: 1
    },
    {
      field: 'height',
      headerName: 'Alto',
      type: 'number'
    },
    {
      field: 'width',
      headerName: 'Ancho',
      type: 'number'
    },
    {
      field: 'ppp',
      headerName: 'PPP',
      type: 'number'
    },
    {
      field: 'available',
      headerName: 'Disponible',
      type: 'boolean'
    }
  ]

  return <BaseTable
    FormModal={SizeFormModal}
    hook={useSizes}
    name='Bordes'
    columns={columns}
  />
}
