import { GridColDef } from '@mui/x-data-grid'
import { BaseTable } from './../../BaseDataTable/BaseTable'
import { useCombo } from '../../../hooks/api/store/useCombo'
import { ComboFormModal } from '../forms/ComboFormModal'

export const TableCombo = () => {
  const useCombos = useCombo()
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
    FormModal={ComboFormModal}
    hook={useCombos}
    name='Colores'
    columns={columns}
  />
}
