import ImageL from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'

interface Image {
  imgUrl: string
  cols?: number
  rows?: number
  featured?: boolean
  author?: string
  title: string
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
  return (
    <ImageL sx={{ width, height }}>
      {images.map((item) => (
        <ImageListItem key={item.imgUrl} cols={item.cols ?? 1} rows={item.rows ?? 1}>
          <img
            src={item.imgUrl}
            srcSet={item.imgUrl}
            alt={item.title}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.title}
            subtitle={item.author}
          />
        </ImageListItem>
      ))}
    </ImageL>
  )
}
