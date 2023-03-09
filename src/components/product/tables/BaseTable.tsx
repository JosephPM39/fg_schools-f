import { Add } from '@mui/icons-material'
import { Button } from '@mui/material'
import { Alert, AlertProps, AlertWithError } from '../../Alert'
import { GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { promiseHandleError } from '../../../api/handlers/errors'
import { IBaseModel } from '../../../api/models_school/base.model'
import { useBase } from '../../../hooks/api/useBase'
import { Table } from '../../Table'
import { BaseFormModalParams } from '../forms/BaseFormModal'

type FormModalParams<T extends IBaseModel> = Omit<BaseFormModalParams<T>, 'Form' | 'name'>

interface BaseTableParams<T extends IBaseModel> {
  name: string
  columns: GridColDef[]
  FormModal: <P extends FormModalParams<T>>(p: P) => JSX.Element
  hook: ReturnType<typeof useBase<T>>
}

export const BaseTable = <T extends IBaseModel>(params: BaseTableParams<T>) => {
  const {
    hook,
    columns,
    name,
    FormModal
  } = params

  const [open, setOpen] = useState(false)
  const [notify, setNotify] = useState<AlertProps | AlertWithError>()
  const [showNotify, setShowNofity] = useState(false)

  useEffect(() => {
    if (notify != null) setShowNofity(true)
  }, [notify])

  const [idForUpdate, setIdForUpdate] = useState<T['id']>()
  const [idForDelete, setIdForDelete] = useState<T['id']>()

  useEffect(() => {
    if (idForUpdate) {
      setOpen(true)
    }
  }, [idForUpdate])

  useEffect(() => {
    if (!idForDelete) return
    void promiseHandleError((error) => {
      setNotify({ error })
    }, async () => await hook.delete({ id: idForDelete })).then(() => {
      setNotify({
        title: 'Éxito',
        details: 'Registro eliminado',
        type: 'success'
      })
      setIdForDelete(undefined)
      hook.launchNextFetch({
        offset: 'previous'
      })
    })
  }, [idForDelete])

  return <>
    <FormModal
      state={[open, setOpen]}
      idForUpdate={idForUpdate}
      onSuccess={() => {
        hook.launchNextFetch({
          offset: 'previous'
        })
      }}
      noButton
    />
    <Table
      columns={columns}
      rows={hook.data}
      onPagination={(limit, offset) => {
        hook.launchNextFetch({ limit, offset })
      }}
      isLoading={hook.data.length < 1 || hook.needFetchNext}
      count={hook.metadata?.count ?? 0}
      name={name}
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
