import { Add } from "@mui/icons-material"
import { Button } from "@mui/material"
import { GridColDef } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { IType } from "../../api/models_school"
import { useType } from "../../hooks/api/products/useType"
import { Table } from "../Table"

export const TableType = () => {

  const useTypes = useType()

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
      field: 'available',
      headerName: 'Disponible',
      type: 'boolean',
    }
  ]

  const [open, setOpen] = useState(false)
  const [idForUpdate, setIdForUpdate] = useState<IType['id']>()


  useEffect(() => {
    if (idForUpdate) {
      setOpen(true)
    }
  }, [idForUpdate])

  return <>
    {// <TypeFormModal state={[open, setOpen]} idForUpdate={idForUpdate} noButton/>
    }
    <Table
      columns={columns}
      rows={useTypes.data}
      onPagination={(limit, offset) => {
        useTypes.launchNextFetch({limit, offset})
      }}
      isLoading={useTypes.data.length < 1 || useTypes.needFetchNext}
      count={useTypes.metadata?.count ?? 0}
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
