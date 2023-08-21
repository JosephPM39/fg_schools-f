import { Card, CardContent, CardMedia, Typography } from '@mui/material'
import { IOrder, IQr, IStudent } from '../../api/models_school'
import QrCode, { QRCodeToDataURLOptions } from 'qrcode'
import { useEffect, useState } from 'react'
import { OrderType } from '../../api/models_school/store/order.model'

interface QrCardParams {
  id: string
  key: string
  qr: IQr
  student: IStudent
  order: IOrder
}

export const QrCard = (params: QrCardParams) => {
  const {
    id,
    key,
    qr,
    student,
    order
  } = params
  const [qrImage, setQrImage] = useState<string | null>(null)

  useEffect(() => {
    const opts: QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      margin: 1,
      color: {
        dark: '#010599FF',
        light: '#FFBF60FF'
      }
    }
    QrCode.toDataURL(qr.url, opts, (_err, _url) => {
      if (_err) return
      setQrImage(_url)
    })
  }, [qr])

  return <Card sx={{ maxWidth: 345 }} id={id} key={key}>
    <CardMedia
      sx={{ height: 140, width: 140 }}
      image={qrImage ?? undefined}
      title={`qr-${student.nickName}`}
    />
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        Nombre en cuadro: {student.nickName}
        Escuela: {}
        Tomado en: {order.type === OrderType.SCHOOL ? 'Escuela' : 'Studio'}
        Total: {order.total}
        Resta: {order.remaining}
      </Typography>
    </CardContent>
  </Card>
}
