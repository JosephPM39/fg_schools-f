import { IGallery, Gallery } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useGallery = (params?: Params) => {
  const hook = useBase<IGallery>({
    path: 'photos/gallery',
    model: Gallery,
    initFetch: params?.initFetch
  })

  return hook
}
