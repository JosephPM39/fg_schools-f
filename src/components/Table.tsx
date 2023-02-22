import { Button, IconButton, Link, MenuItem } from "@mui/material"
import { Box } from "@mui/system"
import {
  DataGrid,
  GridColDef,
  esES,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridRenderCellParams,
  GridToolbarExportContainer,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  GridCsvExportMenuItem,
  GridPrintExportMenuItem,
  useGridApiContext,
  GridExportMenuItemProps,
  GridApi,
} from "@mui/x-data-grid"
import jsPDF from "jspdf"
import autoTable from 'jspdf-autotable'
import csv from 'csvtojson'

import { ReactNode, useEffect, useState } from "react"
import { IBaseModel } from "../api/models_school/base.model"
import { Delete, Edit } from "@mui/icons-material"
import { Dialog } from "../containers/Dialog"

type Params<T extends IBaseModel> = {
  columns: Array<GridColDef>
  rows: Array<T>
  name: string
  disableNumberCol?: true
  toolbar?: {
    add?: ReactNode
  }
  isLoading: boolean
  count: number
  onPageChange: (index: number) => void
  onPageSizeChange: (size: number) => void
} & ({
  disableDefaultActions: true
} | {
  disableDefaultActions?: false
  deleteAction: (id: T['id']) => void
  editAction: (id: T['id']) => void
})

export const GetExpandableCell = ({limit}:{limit:number}) => {

  const ExpandableCell = ({ value }: GridRenderCellParams) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <Box>
        {expanded ? value : value.slice(0, limit)}&nbsp;
        {value.length > limit && (
          <Link
            type="button"
            component="button"
            sx={{ fontSize: 'inherit' }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'ver menos' : 'ver más'}
          </Link>
        )}
      </Box>
    );
  };

  return ExpandableCell
}

const getJsonString = (apiRef: React.MutableRefObject<GridApi>) => {
  // Select rows and columns
  const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef)
  const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef)

  // Format the data. Here we only keep the value
  const data = filteredSortedRowIds.map((id) => {
    const row: Record<string, any> = {}
    visibleColumnsField.forEach((field) => {
      row[field] = apiRef.current.getCellParams(id, field).value;
    });
    return row;
  });

  // Stringify with some indentation
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#parameters
  return JSON.stringify(data, null, 2);
}

const PdfExport = (props: GridExportMenuItemProps<{
  filename: string
  handlerPreWrite?: (pdf: jsPDF) => void
  headerInfo?: (pageIndex: number) => string
}>) => {
  const apiRef = useGridApiContext()
  const { hideMenu } = props
  const filename = props.options?.filename ?? 'Pdf'
  const handler = props.options?.handlerPreWrite ?? (() => {})
  const getHeader = props.options?.headerInfo ?? (() => null)
  const title = filename

  const onClick = () => {
    const csvdata = apiRef.current.getDataAsCsv()
    csv().fromString(csvdata).then((json) => {
      const doc = new jsPDF({
        orientation: 'landscape',
        format: 'letter'
      })
      doc.text(title, 15, 30)
      doc.setFontSize(12);
      handler(doc)
      autoTable(doc, {
        startY: 40,
        head: [Object.keys(json[0])],
        body: json.map((item: object) => Object.values(item))
      })
      const pagesCount = doc.getNumberOfPages()
      for (let i = 0; i < pagesCount; i++) {
        doc.setPage(i)
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        const header = getHeader(i) || 'Reporte';
        const date = new Date()
        const fullDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
        const time = `${date.getHours()}:${date.getMinutes()}`
        const footer = `Página ${i+1} de ${pagesCount} | (${fullDate} - ${time})`;

        // Header
        doc.text(header, 15, 10, { baseline: 'top' });

        // Footer
        doc.text(
          footer,
          pageWidth / 2 - (doc.getTextWidth(footer) / 2),
          pageHeight - 10,
          { baseline: 'bottom' }
        );
      }


      doc.save(filename)
      hideMenu?.();
    })
  }

  return <MenuItem onClick={onClick}>
    Descargar como PDF
  </MenuItem>

}

export const Table = <T extends IBaseModel>(params: Params<T>) => {

  const {
    name,
    isLoading,
    onPageChange,
    onPageSizeChange,
    count
  } = params

  const [openConfirm, setOpenConfirm] = useState(false)
  const [idSelected, setIdSelected] = useState<T['id']>()

  useEffect(() => {
    if (idSelected) {
      setOpenConfirm(true)
    }
  }, [idSelected])

  let columns: Array<GridColDef> = []
  let rows: Array<object> = []

  if (!params.disableNumberCol) {
    columns = [
      {
        field: 'number_index',
        headerName: "#",
        type: 'number',
        width: 50,
      },
      ...params.columns
    ]

    rows = params.rows.map((row, index) => {
      return {
        'number_index': index + 1,
        ...row
      }
    })
  }

  if (!params.disableDefaultActions) {
    const { editAction = () => {} } = params
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
            <IconButton onClick={() => setIdSelected(id as T['id'])}>
              <Delete/>
            </IconButton>
          </>
        }
      }
    ]
  }

  const Toolbar = () => (
    <GridToolbarContainer>
      <GridToolbarDensitySelector/>
      <GridToolbarColumnsButton/>
      <GridToolbarFilterButton/>
      <GridToolbarExportContainer>
        <GridCsvExportMenuItem options={{
          fileName: name,
          utf8WithBom: true
        }} />
        <PdfExport options={{
          filename: name
        }}/>
        <GridPrintExportMenuItem options={{
          hideFooter: true,
          fileName: name,
          hideToolbar: true,
        }}/>
      </GridToolbarExportContainer>
      {params?.toolbar?.add}
    </GridToolbarContainer>
  )

  return <Box sx={{padding: '3', flex: 1, display: 'contents'}}>
    { !params.disableDefaultActions && <Dialog
      title="Eliminar registro"
      state={[openConfirm, setOpenConfirm]}
      description="¿Está seguro que desea eliminar el registro?"
      actions={{
        others: <Button
          onClick={() => {
            if (params.deleteAction) params.deleteAction(idSelected)
            setOpenConfirm(false)
          }}
          children={<>Continuar</>}
        />
      }}
      noButton
    />}
    <DataGrid
      columns={columns}
      rows={rows}
      autoHeight
      rowCount={count}
      loading={isLoading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      disableColumnFilter
      // getRowHeight={() => 'auto'}
      disableSelectionOnClick
      rowsPerPageOptions={[10, 25, 50, 100]}
      initialState={{
        columns: {
          columnVisibilityModel: { id: false }
        },
        pagination: {
          pageSize: 10
        }
      }}
      components={{
        Toolbar: Toolbar,
      }}
      density="compact"
      localeText={{
        ...esES.components.MuiDataGrid.defaultProps.localeText
      }}
    />
  </Box>
}
