import { IconButton } from "@mui/material"
import { GridColDef } from "@mui/x-data-grid"
import { Delete, Edit } from "@mui/icons-material"
import { IBaseModel } from "../../api/models_school/base.model"
import { getOverflowCell } from "./renders"

type Params<T extends IBaseModel> = {
  columns: Array<GridColDef>
  rows: Array<T>
  disableNumberCol?: true
} & ({
  disableDefaultActions: true
} | {
  disableDefaultActions?: false
  deleteAction: (id: T['id']) => void
  editAction: (id: T['id']) => void
})

export const defineGridData = <T extends IBaseModel>(params: Params<T>) => {
  let columns: Array<GridColDef> = []
  let rows: Array<object> = []

  if (!params.disableNumberCol) {
    const cols = params.columns.map((column) => {
      let col: GridColDef = {
        ...column
      }
      if (!column.renderCell && column.type === 'string') {
        col = {
          ...col,
          renderCell: getOverflowCell({ valueGetter: col.valueGetter })
        }
        const tes = column.renderCell
      }
      if (!column.valueFormatter) {
        col = {
          ...col,
          valueFormatter: ({value}) => value
        }
      }
      return col
    })
    columns = [
      {
        field: 'number_index',
        headerName: "#",
        type: 'number',
        width: 50,
      },
      ...cols
    ]

    rows = params.rows.map((row, index) => {
      return {
        'number_index': index + 1,
        ...row
      }
    })
  }

  if (!params.disableDefaultActions) {
    const {
      editAction = () => {},
      deleteAction = () => {}
    } = params
    columns = [
      ...columns,
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Acciones',
        width: 80,
        renderCell: (params) => {
          const { id } = params
          return <>
            <IconButton onClick={() => editAction(id as T['id'])}>
              <Edit/>
            </IconButton>
            <IconButton onClick={() => deleteAction(id as T['id'])}>
              <Delete/>
            </IconButton>
          </>
        }
      }
    ]
  }

  return {
    columns,
    rows
  }
}
