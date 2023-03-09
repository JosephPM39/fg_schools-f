import { GridColDef } from '@mui/x-data-grid'
import { useType } from '../../../hooks/api/products/useType'
import { TypeFormModal } from '../forms/TypeFormModal'
import { BaseTable } from './../../BaseDataTable/BaseTable'

export const TableType = () => {
  const useTypes = useType()

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
    FormModal={TypeFormModal}
    hook={useTypes}
    name='Tipos'
    columns={columns}
  />
}
