import { MenuItem } from "@mui/material"
import {
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  useGridApiContext,
  GridExportMenuItemProps,
  GridApi,
  GridCsvExportOptions,
} from "@mui/x-data-grid"
import jsPDF from "jspdf"
import autoTable from 'jspdf-autotable'
import csv from 'csvtojson'

export const getJsonString = (apiRef: React.MutableRefObject<GridApi>) => {
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

export const PDFExport = (props: GridExportMenuItemProps<{
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
        const footer = `Página ${i+1} de ${pagesCount} | (${fullDate} - ${time}) | Fg Cloud Escuelas`;

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
