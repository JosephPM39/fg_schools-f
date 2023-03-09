import { GridColDef } from '@mui/x-data-grid'
import { useColor } from '../../../hooks/api/products/useColor'
import { getColorCell } from '../../Table/renders'
import { ColorFormModal } from '../forms/ColorFormModal'
import { BaseTable } from './../../BaseDataTable/BaseTable'

export const TableColor = () => {
  const useColors = useColor()
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
      field: 'hex',
      headerName: 'Muestra',
      type: 'string',
      renderCell: getColorCell()
    },
    {
      field: 'available',
      headerName: 'Disponible',
      type: 'boolean'
    }
  ]

  return <BaseTable
    FormModal={ColorFormModal}
    hook={useColors}
    name='Colores'
    columns={columns}
  />
}
