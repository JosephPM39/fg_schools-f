import { Button, Divider, Grid } from '@mui/material'
import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { ErrorCatched, promiseHandleError } from '../../../../../api/handlers/errors'
import { ImageList } from '../../../../ImageList'
import { Photo } from '@mui/icons-material'
import { CardBox } from './../CardBox'
import { Products } from './product'
import { Payments } from './payments'
import { Student } from './student'

export interface FormParams {
  onSuccess?: () => void
  onFail?: (error: ErrorCatched) => void
}

export const Photos = ({ onChange, photos }: { photos: File[], onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => {
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
  // onChangePhotos: (e: ChangeEvent<HTMLInputElement>) => void
  // photos: File[]
}

export const Inputs = (params: InputsParams) => {
  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
        <Products onChange={() => { }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Student onChange={() => { }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Payments total={19} onChange={() => { }} />
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
  // const [photos, setPhotos] = useState<File[]>([])

  /* const onChangePhotos = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const finalFiles: File[] = []
    for (let i = 0; i < files?.length; i++) {
      const element = files?.item(i)
      if (element) finalFiles.push(element)
    }
    setPhotos(finalFiles)
  } */

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
        onChangeStudent={onChangeStudent}
        onChangePayments={onChangePayments}
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
