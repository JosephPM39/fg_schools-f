import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { Button, Divider } from '@mui/material'
import { IColor } from '../../../api/models_school'
import { ErrorCatched, promiseHandleError } from '../../../api/handlers/errors'
import { IBaseModel } from '../../../api/models_school/base.model'
import { useBase } from '../../../hooks/api/useBase'

export interface InputsParams<T extends IBaseModel> {
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, k: keyof T) => void
  data?: Partial<T>
}

export interface BaseFormParams<T extends IBaseModel> {
  idForUpdate?: IColor['id']
  onSuccess?: () => void
  onFail?: (error: ErrorCatched) => void
  Inputs: (p: InputsParams<T>) => JSX.Element
  dataFormatter: (form: FormData) => T
  hook: ReturnType<typeof useBase<T>>
}

export const BaseForm = <T extends IBaseModel>(params: BaseFormParams<T>) => {
  const {
    idForUpdate,
    onSuccess = () => {},
    onFail = () => {},
    hook,
    dataFormatter,
    Inputs
  } = params
  const form = useRef<HTMLFormElement | null>(null)

  const [data, setData] = useState<T>()
  const [isSending, setSending] = useState(false)

  useEffect(() => {
    const getData = async () => {
      if (!idForUpdate || !(data == null)) return
      const res = await hook?.findOne({ id: idForUpdate })
      if (res == null) return
      return setData(res)
    }
    void getData()
  }, [idForUpdate, hook?.data, hook?.data.length, data])

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, k: keyof T) => {
    setData({
      ...data as T,
      [k]: e.target.value
    })
    e.preventDefault()
  }

  const submit = async () => {
    setSending(true)
    const data = dataFormatter(new FormData(form.current ?? undefined))
    await hook.validate({ data })
    if (!idForUpdate) {
      await hook.create(data)
    } else {
      const { id, ...rest } = data
      await hook.update({ id, data: rest })
    }
    setSending(false)
    return onSuccess()
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void promiseHandleError((error) => {
      setSending(false)
      return onFail(error)
    }, submit)
  }

  return <>
    <form ref={form} onSubmit={onSubmit}>
      <Inputs data={data} onChange={onChange} />
      <br/>
      <Divider/>
      <br/>
      <Button type='submit' variant='contained' disabled={isSending}>
        {isSending ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  </>
}
