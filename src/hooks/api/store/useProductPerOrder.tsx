import { IProductOrder, ProductOrder } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useProductPerOrder = (params?: Params) => {
  const hook = useBase<IProductOrder>({
    path: 'store/product-order',
    model: ProductOrder,
    initFetch: params?.initFetch
  })

  return hook
}
