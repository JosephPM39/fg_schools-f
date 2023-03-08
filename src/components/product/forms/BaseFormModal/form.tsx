import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { Button, Divider } from '@mui/material';
import { IColor } from '../../../../api/models_school';
import { Alert, AlertProps, AlertWithError } from '../../../Alert';
import { InvalidDataError, promiseHandleError } from '../../../../api/handlers/errors';
import { IBaseModel } from '../../../../api/models_school/base.model';
import { useBase } from '../../../../hooks/api/useBase';

export interface InputsParams<T extends IBaseModel> {
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, k: keyof T) => void
  data?: Partial<T>
}

export interface BaseFormParams<T extends IBaseModel> {
  idForUpdate?: IColor['id'],
  onSuccess?: () => void
  Inputs: (p: InputsParams<T>) => JSX.Element
  dataFormatter: (form: FormData) => T
  hook: ReturnType<typeof useBase<T>>
}

export const BaseForm = <T extends IBaseModel>(params: BaseFormParams<T>) => {
  const {
    idForUpdate,
    onSuccess = () => {},
    hook,
    dataFormatter,
    Inputs
  } = params
  const form = useRef<HTMLFormElement | null>(null)

  const [data, setData] = useState<T>()
  const [isSending, setSending] = useState(false)

  const [notify, setNotify] = useState<AlertProps | AlertWithError>()
  const [showNotify, setShowNofity] = useState(false)

  useEffect(() => {
    if (notify) setShowNofity(true)
  }, [notify])

  useEffect(() => {
    const getData = async () => {
      if (!idForUpdate || !!data) return
      const res = await hook?.findOne({id: idForUpdate})
      if (!res) return
      return setData(res)
    }
    getData()
  }, [idForUpdate, hook?.data, hook?.data.length, data])

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, k: keyof T) => {
    const d = {
      ...data,
      [k]: e.target.value
    } as T
    setData(d)
    e.preventDefault()
  }

  const submit = async () => {
    setSending(true)
    const data = dataFormatter(new FormData(form.current ?? undefined))
    await hook.validate({ data })
    if (!idForUpdate) {
      await hook.create(data)
    } else {
      const {id, ...rest} = data
      await hook.update({id, data: rest})
    }
    setSending(false)
    setNotify({
      title: 'Éxito',
      details: `Registro ${params?.idForUpdate ? 'actualizado' : 'creado'}`,
      type: 'success'
    })
    return onSuccess()
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    promiseHandleError((error) => {
      console.log((error as InvalidDataError).getErrors())
      setNotify({error})
      setSending(false)
    }, submit)
  }

  return <>
    <form ref={form} onSubmit={onSubmit}>
      <Inputs data={data} onChange={onChange} />
      <br/>
      <Divider/>
      <br/>
      <Button type='submit' variant='contained' disabled={isSending || showNotify}>
        {isSending ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
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
