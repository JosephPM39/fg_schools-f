import { IAlbum, Album } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useAlbum = () => {
  const hook = useBase<IAlbum>({
    path: 'photo/album',
    model: Album
  })

  return hook
}
