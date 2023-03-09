import { IGalleryAlbum, GalleryAlbum } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useGalleryPerAlbum = (params?: Params) => {
  const hook = useBase<IGalleryAlbum>({
    path: 'photos/gallery-album',
    model: GalleryAlbum,
    initFetch: params?.initFetch
  })

  return hook
}
