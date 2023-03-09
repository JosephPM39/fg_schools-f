import { ReactNode, useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import {
  DataGrid,
  GridColDef,
  esES,
  GridSlotsComponent,
  GridInitialState,
  GridColumnVisibilityModel,
  GridRowHeightParams,
  GridRowHeightReturnValue
} from '@mui/x-data-grid'
import { IBaseModel } from '../../api/models_school/base.model'
import { Dialog } from '../../containers/Dialog'
import { Toolbar } from './toolbar'
import { defineGridData } from './defineGridData'
import { useTextWrap } from '../../hooks/useTextWrap'

type Params<T extends IBaseModel> = {
  columns: GridColDef[]
  rows: T[]
  name: string
  disableNumberCol?: true
  handleRowHeight?: (params: GridRowHeightParams) => GridRowHeightReturnValue
  toolbar?: {
    add?: ReactNode
  }
  isLoading: boolean
  count: number
  onPagination?: (limit: number, offset: number) => void
  onPageChange?: (index: number) => void
  onPageSizeChange?: (size: number) => void
  columnVisibilityModel?: GridColumnVisibilityModel
  hideFooterPagination?: boolean
} & ({
  disableDefaultActions: true
} | {
  disableDefaultActions?: false
  deleteAction: (id: T['id']) => void
  editAction: (id: T['id']) => void
  otherAction?: (p: { id: T['id'] }) => JSX.Element
})

export const Table = <T extends IBaseModel>(params: Params<T>) => {
  const [openDeleteWarning, setOpenDeleteWarning] = useState(false)
  const [idToDelete, setIdToDelete] = useState<T['id']>()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const {
    name,
    isLoading,
    onPageChange = () => {},
    onPageSizeChange = () => {},
    onPagination = () => {},
    count,
    columnVisibilityModel,
    handleRowHeight,
    hideFooterPagination,
    toolbar,
    ...defineGridDataConf
  } = params

  useEffect(() => {
    const pageIndex = page >= 0 ? page : 0
    const offset = pageSize * pageIndex
    onPagination(pageSize, offset)
  }, [page, pageSize])

  useEffect(() => {
    if (idToDelete) {
      setOpenDeleteWarning(true)
    }
  }, [idToDelete])

  const onPageChangeHandle = (newPage: number) => {
    if (page < 0 || newPage < 0) return setPage(0)
    setPage(newPage)
    onPageChange(newPage)
  }

  const onPageSizeChangeHandle = (newSize: number) => {
    setPageSize(newSize)
    setPage(-1)
    onPageSizeChange(newSize)
  }

  const { localeText } = esES.components.MuiDataGrid.defaultProps
  const useTextWrapper = useTextWrap()

  const components: Partial<GridSlotsComponent> = {
    Toolbar: () => <Toolbar
      name={useTextWrapper.formatTextWrap(name, 90)}
      actions={{
        other: params.toolbar?.add
      }}
    />
  }

  const initialState: GridInitialState = {
    columns: {
      columnVisibilityModel: {
        id: false,
        ...columnVisibilityModel
      }
    }
  }

  const { columns, rows } = defineGridData({
    ...defineGridDataConf,
    ...{ deleteAction: (id) => setIdToDelete(id) }
  })

  const DeleteWarning = () => {
    if (params.disableDefaultActions) return <></>
    return <Dialog
      title="Eliminar registro"
      state={[openDeleteWarning, setOpenDeleteWarning]}
      description="¿Está seguro que desea eliminar el registro?"
      actions={{
        others: <Button
          onClick={() => {
            if (params.deleteAction) params.deleteAction(idToDelete)
            setOpenDeleteWarning(false)
          }}
          children={<>Continuar</>}
        />
      }}
      noButton
    />
  }

  return <Box sx={{ padding: '3', flex: 1, display: 'contents' }}>
    <DeleteWarning/>
    <DataGrid
      columns={columns}
      rows={rows}
      autoHeight
      loading={isLoading}
      pagination
      hideFooterPagination={hideFooterPagination}
      getRowHeight={handleRowHeight}
      rowCount={count}
      page={(page >= 0) ? page : 0}
      pageSize={pageSize}
      rowsPerPageOptions={[10, 25, 50, 100]}
      onPageChange={onPageChangeHandle}
      onPageSizeChange={onPageSizeChangeHandle}
      disableColumnFilter
      disableSelectionOnClick
      initialState={initialState}
      components={components}
      density="compact"
      localeText={localeText}
    />
  </Box>
}
