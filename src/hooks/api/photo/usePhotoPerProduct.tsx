import { IPhotoProduct, PhotoProduct } from '../../../api/models_school'
import { useBase } from '../useBase'

export const usePhotoPerProduct = () => {
  const hook = useBase<IPhotoProduct>({
    path: 'photo/photo-product',
    model: PhotoProduct
  })

  return hook
}
