import { Add } from '@mui/icons-material'
import { Button } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { IModel } from '../../../api/models_school'
import { useModel } from '../../../hooks/api/products/useModel'
import { ModelFormModal } from '../forms/ModelFormModal'
import { Table } from '../../Table'
import { Alert, AlertProps, AlertWithError } from '../../Alert'
import { promiseHandleError } from '../../../api/handlers/errors'

export const TableModel = () => {
  const useModels = useModel()

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      type: 'string',
      disableExport: true,
      flex: 1
    },
    {
      field: 'name',
      headerName: 'Nombre',
      type: 'string',
      flex: 1
    },
    {
      field: 'price',
      headerName: 'Precio normal',
      type: 'string'
    },
    {
      field: 'offer',
      headerName: 'Precio promoción',
      type: 'string'
    },
    {
      field: 'available',
      headerName: 'Disponible',
      type: 'boolean'
    }
  ]

  const [open, setOpen] = useState(false)
  const [notify, setNotify] = useState<AlertProps | AlertWithError>()
  const [showNotify, setShowNofity] = useState(false)

  useEffect(() => {
    if (notify != null) setShowNofity(true)
  }, [notify])

  const [idForUpdate, setIdForUpdate] = useState<IModel['id']>()
  const [idForDelete, setIdForDelete] = useState<IModel['id']>()

  useEffect(() => {
    if (idForUpdate) {
      setOpen(true)
    }
  }, [idForUpdate])

  useEffect(() => {
    if (!idForDelete) return
    void promiseHandleError((error) => {
      setNotify({ error })
    }, async () => await useModels.delete({ id: idForDelete })).then(() => {
      setNotify({
        title: 'Éxito',
        details: 'Modelo eliminado',
        type: 'success'
      })
      setIdForDelete(undefined)
      useModels.launchNextFetch({
        offset: 'previous'
      })
    })
  }, [idForDelete])

  return <>
    <ModelFormModal state={[open, setOpen]} idForUpdate={idForUpdate} onSuccess={() => {
      useModels.launchNextFetch({
        offset: 'previous'
      })
    }} noButton/>
    <Table
      columns={columns}
      rows={useModels.data}
      onPagination={(limit, offset) => {
        useModels.launchNextFetch({ limit, offset })
      }}
      isLoading={useModels.data.length < 1 || useModels.needFetchNext}
      count={useModels.metadata?.count ?? 0}
      name="Modelos de productos"
      deleteAction={(id) => setIdForDelete(id)}
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
    <Alert
      show={showNotify}
      onClose={() => {
        setShowNofity(false)
        setNotify(undefined)
      }}
      {...notify}
    />
  </>
}
