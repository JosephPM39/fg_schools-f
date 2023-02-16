import { Box } from "@mui/system"
import { DataGrid, GridColDef } from "@mui/x-data-grid"

interface Params<T extends object> {
  columns: Array<GridColDef>
  rows: Array<T>
}

export const Table = <T extends object>(params: Params<T>) => {
  return <Box sx={{height: '500px', width: '100%', padding: '3'}}>
    <DataGrid
      {...params}
    />
  </Box>
}
