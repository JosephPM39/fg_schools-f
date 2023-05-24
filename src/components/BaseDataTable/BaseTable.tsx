import { Add } from '@mui/icons-material'
import { Button } from '@mui/material'
import { Alert, AlertProps, AlertWithError } from '../Alert'
import { GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { promiseHandleError } from '../../api/handlers/errors'
import { IBaseModel } from '../../api/models_school/base.model'
import { useBase } from '../../hooks/api/useBase'
import { Table } from '../Table'
import { BaseFormModalParams } from './BaseFormModal'
import { BtnContainer, BtnPropsContainer, NoBtnContainer } from '../../containers/types'

type FormModalParams<T extends IBaseModel> = Omit<BaseFormModalParams<T>, 'Form' | 'name'> & ((BtnContainer | BtnPropsContainer | NoBtnContainer) | undefined)

interface BaseTableParams<T extends IBaseModel> {
  name: string
  columns: GridColDef[]
  FormModal: <P extends FormModalParams<T>>(p: P) => JSX.Element
  hook: ReturnType<typeof useBase<T>>
  otherAction?: (p: { id: T['id'] }) => JSX.Element
  onPagination?: (limit: number, offset: number) => void
}

export const BaseTable = <T extends IBaseModel>(params: BaseTableParams<T>) => {
  const {
    hook,
    columns,
    name,
    FormModal,
    otherAction
  } = params

  const defaultOnPagination = (limit: number, offset: number) => {
    hook.launchNextFetch({ limit, offset })
  }

  const onPagination = params.onPagination ?? defaultOnPagination

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
      onFail={(error) => {
        setNotify({ error })
      }}
      onSuccess={() => {
        setNotify({
          title: 'Éxito',
          details: `Registro ${idForUpdate ? 'actualizado' : 'creado'}`,
          type: 'success'
        })
        setOpen(false)
        hook.launchNextFetch({
          offset: 'previous'
        })
      }}
      noButton
    />
    <Table
      columns={columns}
      rows={hook.data}
      onPagination={onPagination}
      isLoading={hook.data.length < 1 || hook.needFetchNext}
      count={hook.metadata?.count ?? 0}
      name={name}
      otherAction={otherAction}
      deleteAction={(id) => setIdForDelete(id)}
      editAction={(id) => setIdForUpdate(id)}
      toolbar={{
        add: <Button startIcon={<Add />} onClick={() => {
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
        setTimeout(() => {
          setNotify(undefined)
        }, 500)
      }}
      {...notify}
    />

  </>
}
