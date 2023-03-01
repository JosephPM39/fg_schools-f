import { Product, IProduct } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useProduct = (params?: Params) => {
  const hook = useBase<IProduct>({
    path: 'products/product',
    model: Product,
    initFetch: params?.initFetch
  })

  return hook
}
