import { IAlbum, Album } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useAlbum = (params?: Params) => {
  const hook = useBase<IAlbum>({
    path: 'photos/album',
    model: Album,
    initFetch: params?.initFetch
  })

  return hook
}
