import { Add } from "@mui/icons-material"
import { Button } from "@mui/material"
import { GridColDef } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { ISize } from "../../api/models_school"
import { useSize } from "../../hooks/api/products/useSize"
import { Table } from "../Table"

export const TableSize = () => {

  const useSizes = useSize()

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: "ID",
      type: 'string',
      disableExport: true,
      flex: 1
    },
    {
      field: 'height',
      headerName: 'Alto',
      type: 'number',
    },
    {
      field: 'width',
      headerName: 'Ancho',
      type: 'number',
    },
    {
      field: 'ppp',
      headerName: 'PPP',
      type: 'number',
    },
    {
      field: 'available',
      headerName: 'Disponible',
      type: 'boolean',
    }
  ]

  const [open, setOpen] = useState(false)
  const [idForUpdate, setIdForUpdate] = useState<ISize['id']>()


  useEffect(() => {
    if (idForUpdate) {
      setOpen(true)
    }
  }, [idForUpdate])

  return <>
    {// <SizeFormModal state={[open, setOpen]} idForUpdate={idForUpdate} noButton/>
    }
    <Table
      columns={columns}
      rows={useSizes.data}
      onPagination={(limit, offset) => {
        useSizes.launchNextFetch({limit, offset})
      }}
      isLoading={useSizes.data.length < 1 || useSizes.needFetchNext}
      count={useSizes.metadata?.count ?? 0}
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
