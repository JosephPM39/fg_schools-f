import { Download } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import ImageL from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'

export type Image = {
  imgUrl: string
  downloadUrl?: string
  cols?: number
  rows?: number
  featured?: boolean
  subTitle?: string
  title: string
  imgName: string
}

interface ImageListParams {
  images: Image[]
  width?: string | number
  height?: string | number
}

export const ImageList = (params: ImageListParams) => {
  const {
    images,
    width = 'auto',
    height = 'auto'
  } = params

  const DownloadAction = ({ img }: { img: Image }) => {
    const url = img.downloadUrl
    if (!url) return <></>
    return <IconButton
      onClick={(e) => {
        e.preventDefault()
        const link = document.createElement('a')
        link.download = img.imgName
        link.href = url
      }}
      sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
      aria-label={`info about ${img.title}`}
    >
      <Download />
    </IconButton>
  }

  return (
    <ImageL sx={{ width, height }}>
      {images.map((item) => {
        return <ImageListItem key={item.imgUrl} cols={item.cols ?? 1} rows={item.rows ?? 1}>
          <img
            src={item.imgUrl}
            srcSet={item.imgUrl}
            alt={item.title}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.title}
            subtitle={item.subTitle}
            actionIcon={<DownloadAction img={item} />}
          />
        </ImageListItem>
      })}
    </ImageL>
  )
}
