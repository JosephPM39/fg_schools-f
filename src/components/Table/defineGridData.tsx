import { IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { Delete, Edit } from '@mui/icons-material'
import { IBaseModel } from '../../api/models_school/base.model'
import { getOverflowCell } from './renders'

type Params<T extends IBaseModel> = {
  columns: GridColDef[]
  rows: T[]
  disableNumberCol?: true
} & ({
  disableDefaultActions: true
} | {
  disableDefaultActions?: false
  deleteAction: (id: T['id']) => void
  editAction: (id: T['id']) => void
  otherAction?: (p: { id: T['id'] }) => JSX.Element
})

export const defineGridData = <T extends IBaseModel>(params: Params<T>) => {
  let columns: GridColDef[] = []
  let rows: object[] = []

  if (!params.disableNumberCol) {
    const cols = params.columns.map((column) => {
      let col: GridColDef = {
        ...column
      }
      if (((column?.renderCell) == null) && column?.type === 'string') {
        col = {
          ...col,
          renderCell: getOverflowCell({ valueGetter: col.valueGetter })
        }
      }
      return col
    })
    columns = [
      {
        field: 'number_index',
        headerName: '#',
        type: 'number',
        width: 50
      },
      ...cols
    ]

    rows = params.rows.map((row, index) => {
      return {
        number_index: index + 1,
        ...row
      }
    })
  }

  if (!params.disableDefaultActions) {
    const {
      editAction = () => {},
      deleteAction = () => {},
      otherAction: OtherAction = () => <></>
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
            <OtherAction id={id as T['id']}/>
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
