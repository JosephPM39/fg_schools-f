import { GridColDef } from '@mui/x-data-grid'
import { useBorder } from '../../../hooks/api/products/useBorder'
import { BorderFormModal } from '../forms/BorderFormModal'
import { BaseTable } from './../../BaseDataTable/BaseTable'

export const TableBorder = () => {
  const useBorders = useBorder()
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
      field: 'available',
      headerName: 'Disponible',
      type: 'boolean'
    }
  ]

  return <BaseTable
    FormModal={BorderFormModal}
    hook={useBorders}
    name='Bordes'
    columns={columns}
  />
}
