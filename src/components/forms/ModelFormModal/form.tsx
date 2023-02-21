import { ChangeEvent, FormEvent, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Divider, FormControlLabel, FormLabel, Grid, InputAdornment, Radio, RadioGroup, TextField } from '@mui/material';
import { IModel } from '../../../api/models_school';
import { Alert, AlertProps, AlertWithError } from '../../Alert';
import { InvalidDataError, isInvalidDataError, promiseHandleError } from '../../../api/handlers/errors';
import { ModelContext } from '../../../context/api/products';
import { useModel } from '../../../hooks/api/products/useModel';

interface Params {
  idForUpdate?: IModel['id'],
}

export const Form = (params: Params) => {
  const { idForUpdate } = params
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
      console.log('1')
      if (!idForUpdate || !!data) return
      console.log('2')
      const res = await useModels?.findOne({id: idForUpdate})
      console.log('3', res, useModels?.findOne)
      if (!res) return
      console.log('res', res)
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

  return <>
    <form ref={form}>
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
              minLength: 1,
              maxLength: 40,
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
              minLength: 1,
              maxLength: 55,
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
