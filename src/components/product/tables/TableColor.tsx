import { Add } from "@mui/icons-material"
import { Button } from "@mui/material"
import { GridColDef } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { IColor } from "../../../api/models_school"
import { useColor } from "../../../hooks/api/products/useColor"
import { Table } from "../../Table"
import { getColorCell } from "../../Table/renders"

export const TableColor = () => {

  const useColors = useColor()

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: "ID",
      type: 'string',
      disableExport: true,
      flex: 1
    },
    {
      field: 'name',
      headerName: 'Nombre',
      type: 'string',
      flex: 1,
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
      type: 'boolean',
    }
  ]

  const [open, setOpen] = useState(false)
  const [idForUpdate, setIdForUpdate] = useState<IColor['id']>()


  useEffect(() => {
    if (idForUpdate) {
      setOpen(true)
    }
  }, [idForUpdate])

  return <>
    {// <ColorFormModal state={[open, setOpen]} idForUpdate={idForUpdate} noButton/>
    }
    <Table
      columns={columns}
      rows={useColors.data}
      onPagination={(limit, offset) => {
        useColors.launchNextFetch({limit, offset})
      }}
      isLoading={useColors.data.length < 1 || useColors.needFetchNext}
      count={useColors.metadata?.count ?? 0}
      name="Bordes de productos"
      deleteAction={(id) => console.log(id)}
      editAction={(id) => setIdForUpdate(id)}
      toolbar={{
        add: <Button startIcon={<Add/>} onClick={() => {
          setIdForUpdate(undefined)
          setOpen(true)
        }}>
          Nuevo
        </Button>
      }}

    />
  </>
}
