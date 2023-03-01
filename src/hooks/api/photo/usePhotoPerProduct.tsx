import { IPhotoProduct, PhotoProduct } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const usePhotoPerProduct = (params?: Params) => {
  const hook = useBase<IPhotoProduct>({
    path: 'photos/photo-product',
    model: PhotoProduct,
    initFetch: params?.initFetch
  })

  return hook
}
