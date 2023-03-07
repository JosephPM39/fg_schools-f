import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Divider, FormControlLabel, Grid, InputAdornment, TextField } from '@mui/material';
import { IModel } from '../../../../api/models_school';
import { Alert, AlertProps, AlertWithError } from '../../../Alert';
import { useModel } from '../../../../hooks/api/products/useModel';
import { getData } from './getData';
import { InvalidDataError, promiseHandleError } from '../../../../api/handlers/errors';

interface Params {
  idForUpdate?: IModel['id'],
  onSuccess?: () => void
}

export const Form = (params: Params) => {
  const { idForUpdate, onSuccess = () => {} } = params
  const form = useRef<HTMLFormElement | null>(null)

  const [data, setData] = useState<IModel>()
  const [isSending, setSending] = useState(false)

  const useModels = useModel()

  const [notify, setNotify] = useState<AlertProps | AlertWithError>()
  const [showNotify, setShowNofity] = useState(false)

  useEffect(() => {
    if (notify) setShowNofity(true)
  }, [notify])

  useEffect(() => {
    const getData = async () => {
      if (!idForUpdate || !!data) return
      const res = await useModels?.findOne({id: idForUpdate})
      if (!res) return
      return setData(res)
    }
    getData()
  }, [idForUpdate, useModels?.data, useModels?.data.length, data])

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, k: keyof IModel) => {
    const d = {
      ...data,
      [k]: e.target.value
    } as IModel
    setData(d)
    e.preventDefault()
  }

  const submit = async () => {
    setSending(true)
    const data = getData(new FormData(form.current ?? undefined))
    await useModels.validate({ data })
    if (!idForUpdate) {
      await useModels.create(data)
    } else {
      const {id, ...rest} = data
      await useModels.update({id, data: rest})
    }
    setSending(false)
    setNotify({
      title: 'Éxito',
      details: `Modelo ${params?.idForUpdate ? 'actualizado' : 'creado'}`,
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
      <input
        name="model_id"
        type='text'
        value={data?.['id'] || ''}
        onChange={() => {}}
        hidden
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            value={data?.name || ''}
            onChange={(e) => onChange(e, 'name')}
            InputLabelProps={{
              shrink: !!data?.name
            }}
            name="name"
            label="Nombre"
            type='text'
            inputProps={{
              minLength: 1,
              maxLength: 40,
            }}
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            value={data?.price || ''}
            onChange={(e) => onChange(e, 'price')}
            name="price"
            label="Precio"
            type='number'
            inputProps={{
              min: 0.01,
              max: 9999.99,
              step: 0.01
            }}
            InputProps={{
              startAdornment: <InputAdornment position='start' children='$'/>
            }}
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            value={data?.offer || ''}
            onChange={(e) => onChange(e, 'offer')}
            name="offer"
            label="Precio para promoción"
            type='number'
            inputProps={{
              min: 0.01,
              max: 9999.99,
              step: 0.01
            }}
            InputProps={{
              startAdornment: <InputAdornment position='start' children='$'/>
            }}
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            label='Disponible'
            control={<Checkbox
              defaultChecked={data?.available}
              name='available'
            />}
          />
        </Grid>
      </Grid>
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
