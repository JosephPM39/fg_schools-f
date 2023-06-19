import { Button, Card, CardContent, Divider, Grid, TextField, Typography } from '@mui/material'
import { Inputs as PaymentInputs } from '../PaymentFormModal/form'
import { ChangeEvent, FormEvent, ReactNode, useRef, useState } from 'react'
import { ErrorCatched, promiseHandleError } from '../../../../api/handlers/errors'
import { ImageList } from '../../../ImageList'
import { Photo } from '@mui/icons-material'

export interface FormParams {
  onSuccess?: () => void
  onFail?: (error: ErrorCatched) => void
}

const CardBox = ({ children, title, actions }: { children: ReactNode, title: string, actions?: ReactNode }) => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={!actions ? 12 : 6} sm={!actions ? 12 : 6}>
            <Typography variant='h6' component='div' color='text.secondary'>{title}</Typography>
          </Grid>
          {actions && <Grid item display='flex' justifyContent='flex-end' component='div'>
            {actions}
          </Grid>}
          <Grid item xs={12} sm={12}>
            {children}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const Payments = ({ onChange }: { onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => (
  <CardBox title='Pago / Abono'>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          value={''}
          onChange={(e) => e}
          InputLabelProps={{
            shrink: !!''
          }}
          name="total_pay"
          label="Total"
          type='number'
          inputProps={{
            max: 9999.99,
            min: 0.01,
            step: 0.01
          }}
          disabled
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <PaymentInputs onChange={() => { }} />
      </Grid>
    </Grid>
  </CardBox>
)

const Student = ({ onChange }: { onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => (
  <CardBox title='Datos del estudiante'>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={''}
          onChange={(e) => e}
          InputLabelProps={{
            shrink: !!''
          }}
          name="first_name"
          label="Nombre(s)"
          inputProps={{
            maxLength: 40,
            minLength: 1
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={''}
          onChange={(e) => e}
          InputLabelProps={{
            shrink: !!''
          }}
          name="last_name"
          label="Apellido(s)"
          inputProps={{
            maxLength: 40,
            minLength: 1
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={''}
          onChange={(e) => e}
          InputLabelProps={{
            shrink: !!''
          }}
          name="nick_name"
          label="Nombre para Cuadro"
          inputProps={{
            maxLength: 100,
            minLength: 1
          }}
          variant="outlined"
          required
        />
      </Grid>
    </Grid>
  </CardBox>
)

const Products = ({ onChange }: { onChange: () => void }) => {
  return <></>
}

const Photos = ({ onChange, photos }: { photos: File[], onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => {
  const images = photos.map((photo) => ({
    imgUrl: URL.createObjectURL(photo),
    title: photo.name
  }))
  return <CardBox title='Fotos' actions={<>
    <Button
      onClick={() => {
        document.getElementById('photos_chooser')?.click()
      }}
      endIcon={<Photo />}
    >
      Buscar
    </Button>
  </>}>
    <input
      hidden
      id='photos_chooser'
      accept="image/*"
      type="file"
      name="photos"
      multiple
      onChange={onChange}
    />
    <ImageList
      images={images}
      height={300}
    />
  </CardBox>
}

interface InputsParams {
  onChangeStudent: (e: ChangeEvent<HTMLInputElement>) => void
  onChangePayments: (e: ChangeEvent<HTMLInputElement>) => void
  onChangePhotos: (e: ChangeEvent<HTMLInputElement>) => void
  photos: File[]
}

export const Inputs = (params: InputsParams) => {
  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Student onChange={params.onChangeStudent} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Payments onChange={params.onChangePayments} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Products onChange={() => { }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Photos photos={params.photos} onChange={params.onChangePhotos} />
      </Grid>
    </Grid>
  </>
}

export const Form = (params: FormParams) => {
  const {
    onSuccess = () => { },
    onFail = () => { }
  } = params

  const form = useRef<HTMLFormElement | null>(null)
  const [isSending, setSending] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])

  const onChangePhotos = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const finalFiles: File[] = []
    for (let i = 0; i < files?.length; i++) {
      const element = files?.item(i)
      if (element) finalFiles.push(element)
    }
    setPhotos(finalFiles)
  }

  const onChangePayments = () => { }
  const onChangeStudent = () => { }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void promiseHandleError((error) => {
      setSending(false)
      return onFail(error)
    }, submit)
  }

  const submit = async () => {
    onSuccess()
  }

  return (
    <form ref={form} onSubmit={onSubmit}>
      <Inputs
        photos={photos}
        onChangeStudent={onChangeStudent}
        onChangePayments={onChangePayments}
        onChangePhotos={onChangePhotos}
      />
      <br />
      <Divider />
      <br />
      <Button type='submit' variant='contained' disabled={isSending}>
        {isSending ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  )
}
