import { Cloud, CloudOff, QrCode } from '@mui/icons-material'
import { Box, Button, Card, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import { useQr } from '../../hooks/api/photo/useQr'
import { IGallery, IOrder, IQr } from '../../api/models_school'
import { v4 as uuidV4 } from 'uuid'
import { CONFIG } from '../../config'
import { Image } from '../ImageList'
import { WithRequired } from '../types'
import { useGallery } from '../../hooks/api/photo/useGallery'

type QrParams = {
  orderList: Array<WithRequired<IOrder, 'studentId' | 'id'>>
}

export const Qr = (params: QrParams) => {
  const { orderList } = params
  const [galleryList, setGalleryList] = useState<IGallery[]>([])
  const [qrList, setQrList] = useState<IQr[]>([])
  const [mode, setMode] = useState<'update' | 'create' | null>(null)
  const [allDisable, setAllDisable] = useState<boolean>(false)
  const [images, setImages] = useState<Image[]>([])
  const useQrs = useQr({ initFetch: false })
  const useGalleries = useGallery({ initFetch: false })

  useEffect(() => {
    const getData = async () => {
      const galleryList: IGallery[] = []
      for (let i = 0; i < orderList.length; i++) {
        const orderId = orderList[i].id
        const galleries = await useGalleries.findBy({ orderId })
        if (galleries) {
          galleryList.push(...galleries)
        }
      }
      setGalleryList(galleryList)
    }
    void getData()
  }, [orderList])

  useEffect(() => {
    const getData = async () => {
      const qrList: IQr[] = []
      for (let i = 0; i < galleryList.length; i++) {
        const galleryId = galleryList[i].id
        const res = await useQrs.findBy({ galleryId })
        if (res) {
          qrList.push(res[0])
        }
      }
      setQrList(qrList)
    }
    void getData()
  }, [galleryList])

  const create = async () => {
    for (let i = 0; i < galleryList.length; i++) {
      const galleryId = galleryList[i].id
      const code = uuidV4()
      await useQrs.create({
        galleryId,
        code,
        url: `${CONFIG.schoolsQrUrl}/${code}`,
        available: true
      })
    }
  }

  const update = async () => {
    for (let i = 0; i < qrList.length; i++) {
      const qr = qrList[i]
      const code = uuidV4()
      await useQrs.update({
        data: {
          code,
          url: `${CONFIG.schoolsQrUrl}/${code}`,
          available: true
        },
        id: qr?.id
      })
    }
  }

  const updateAvailable = async (available: boolean) => {
    for (let i = 0; i < qrList.length; i++) {
      const qr = qrList[i]
      await useQrs.update({
        data: { available },
        id: qr?.id
      })
    }
  }

  const createOrUpdate = async () => {
    if (!mode) return
    if (mode === 'create') return await create()
    return await update()
  }

  useEffect(() => {
    setAllDisable(qrList.every((qr) => !qr.available))
    if (qrList.length < 1) return setMode('create')
    return setMode('update')
  }, [qrList])

  return <>
    <Box>
      <Button
        onClick={createOrUpdate}
        startIcon={<QrCode />}
      >
        {mode === 'update' ? 'Regenerar' : 'Crear'}
      </Button>
      <Button
        startIcon={allDisable ? <CloudOff /> : <Cloud />}
        onClick={async () => await updateAvailable(!allDisable)}
      >
        {allDisable ? 'Deshabilitar' : 'Habilitar'}
      </Button>
      <Grid container>
        {images.map(() => <Grid>
          <Card>

          </Card>
        </Grid>)}
      </Grid>
    </Box>
  </>
}
