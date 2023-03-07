import { Add } from "@mui/icons-material"
import { Button } from "@mui/material"
import { GridColDef } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { IModel } from "../../../api/models_school"
import { useModel } from "../../../hooks/api/products/useModel"
import { ModelFormModal } from "../forms/ModelFormModal"
import { Table } from "../../Table"

export const TableModel = () => {

  const useModels = useModel()

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
      field: 'price',
      headerName: 'Precio normal',
      type: 'string',
    },
    {
      field: 'offer',
      headerName: 'Precio promoción',
      type: 'string',
    },
    {
      field: 'available',
      headerName: 'Disponible',
      type: 'boolean',
    }
  ]

  const [open, setOpen] = useState(false)
  const [idForUpdate, setIdForUpdate] = useState<IModel['id']>()


  useEffect(() => {
    if (idForUpdate) {
      setOpen(true)
    }
  }, [idForUpdate])

  return <>
    <ModelFormModal state={[open, setOpen]} idForUpdate={idForUpdate} noButton/>
    <Table
      columns={columns}
      rows={useModels.data}
      onPagination={(limit, offset) => {
        useModels.launchNextFetch({limit, offset})
      }}
      isLoading={useModels.data.length < 1 || useModels.needFetchNext}
      count={useModels.metadata?.count ?? 0}
      name="Modelos de productos"
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
