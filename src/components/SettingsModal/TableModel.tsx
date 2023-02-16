import { GridColDef } from "@mui/x-data-grid"
import { useModel } from "../../hooks/api/products/useModel"
import { Table } from "../Table"

export const TableModel = () => {

  const useModels = useModel()

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Nombre',
      type: 'string',
    },
    {
      field: 'price',
      headerName: 'Precio normal',
      type: 'string',
    },
    {
      field: 'offer',
      headerName: 'Precio promoción',
      type: 'string',
    },
    {
      field: 'available',
      headerName: 'Disponible',
      type: 'boolean',
    }
  ]

  const rows: Array<{}> = useModels.data

  return <Table columns={columns} rows={rows}/>
}
