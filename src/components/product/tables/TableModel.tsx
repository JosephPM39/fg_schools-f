import { GridColDef } from '@mui/x-data-grid'
import { useModel } from '../../../hooks/api/products/useModel'
import { BaseTable } from '../../BaseDataTable/BaseTable'
import { ModelFormModal } from '../forms/ModelFormModal'

export const TableModel = () => {
  const useModels = useModel()

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
      field: 'price',
      headerName: 'Precio normal',
      type: 'string'
    },
    {
      field: 'offer',
      headerName: 'Precio promoción',
      type: 'string'
    },
    {
      field: 'available',
      headerName: 'Disponible',
      type: 'boolean'
    }
  ]

  return <BaseTable
    FormModal={ModelFormModal}
    hook={useModels}
    name='Modelos'
    columns={columns}
  />
}
