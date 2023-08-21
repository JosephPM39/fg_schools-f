import { useEffect, useState } from 'react'
import { IAlbum, IGallery, IGalleryAlbum, IOrder } from '../../api/models_school'
import { useGallery } from '../../hooks/api/photo/useGallery'
import { useAlbum } from '../../hooks/api/photo/useAlbum'
import { useGalleryPerAlbum } from '../../hooks/api/photo/useGalleryPerAlbum'
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material'
import { ExpandMore, QrCode } from '@mui/icons-material'
import { Album } from './Album'

interface GalleryParams {
  orderId: IOrder['id']
  includePrivate?: boolean
}

export const Gallery = (params: GalleryParams) => {
  const {
    orderId,
    includePrivate = false
  } = params
  const [albums, setAlbums] = useState<IAlbum[]>([])
  const [galleries, setGalleries] = useState<IGallery[]>([])
  const useGalleries = useGallery({ initFetch: false })
  const useAlbums = useAlbum({ initFetch: false })
  const useAlbumsPerGallery = useGalleryPerAlbum({ initFetch: false })
  const [albumShowing, setAlbumShowing] = useState<number | null>(null)

  useEffect(() => {
    if (!orderId) return
    const getData = async () => {
      const res = await useGalleries.findBy({ orderId })
      if (!res) return
      setGalleries(res)
    }
    void getData()
  }, [orderId])

  useEffect(() => {
    const getData = async () => {
      const albumsPerGallery: IGalleryAlbum[] = []
      for (let i = 0; i < galleries.length; i++) {
        const gallery = galleries[i]
        const albums = await useAlbumsPerGallery.findBy({ galleryId: gallery.id })
        if (albums) {
          albumsPerGallery.push(...albums.filter((album) => {
            if (!includePrivate) return album.public
            return true
          }))
        }
      }

      const albumsId: Array<IAlbum['id']> = albumsPerGallery.map((item) => item.albumId)
      const albums: IAlbum[] = []
      for (let i = 0; i < albumsId.length; i++) {
        const id = albumsId[i]
        const album = await useAlbums.findOne({ id })
        if (album) {
          albums.push(album)
        }
      }
      setAlbums(albums)
    }
    void getData()
  }, [galleries])

  const handleChange = (panel: number) => (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (panel === albumShowing) return
    setAlbumShowing(panel)
  }

  return <>
    <Button
      startIcon={<QrCode />}
    >
      QR
    </Button>
    {albums.map((album, index) => {
      return <Accordion expanded={albumShowing === index} onChange={handleChange(index)}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls={`panel-${index}-content`}
          id={`panel-${index}-header`}
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            {album.name}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Album albumId={album.id} />
        </AccordionDetails>
      </Accordion>
    })}
    {albums.length < 1 ??
      <Typography>
        Sin albums
      </Typography>
    }
  </>
}
