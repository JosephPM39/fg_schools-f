import { IGalleryAlbum, GalleryAlbum} from '../../../api/models_school'
import { useBase } from '../useBase'

export const useGalleryPerAlbum = () => {
  const hook = useBase<IGalleryAlbum>({
    path: 'photos/gallery-album',
    model: GalleryAlbum
  })

  return hook
}