import { Add } from "@mui/icons-material"
import { Button } from "@mui/material"
import { GridColDef } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { IBorder } from "../../api/models_school"
import { useBorder } from "../../hooks/api/products/useBorder"
import { Table } from "../Table"
import { GetButtonCell } from "../Table/renders"

export const TableBorder = () => {

  const useBorders = useBorder()

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
      field: 'file',
      headerName: 'Archivo',
      type: 'string',
      renderCell: GetButtonCell({
        onClick({ value }) {
          alert(value)
        },
        label: 'Ver'
      })
    },
    {
      field: 'available',
      headerName: 'Disponible',
      type: 'boolean',
    }
  ]

  const [open, setOpen] = useState(false)
  const [idForUpdate, setIdForUpdate] = useState<IBorder['id']>()


  useEffect(() => {
    if (idForUpdate) {
      setOpen(true)
    }
  }, [idForUpdate])

  return <>
    {// <BorderFormModal state={[open, setOpen]} idForUpdate={idForUpdate} noButton/>
    }
    <Table
      columns={columns}
      rows={useBorders.data}
      onPagination={(limit, offset) => {
        useBorders.launchNextFetch({limit, offset})
      }}
      isLoading={useBorders.data.length < 1 || useBorders.needFetchNext}
      count={useBorders.metadata?.count ?? 0}
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
