import { Product, IProduct } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useProduct = () => {
  const hook = useBase<IProduct>({
    path: 'products/product',
    model: Product
  })

  return hook
}
