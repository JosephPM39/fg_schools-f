import { IProductCombo, ProductCombo } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useProductPerCombo = (params?: Params) => {
  const hook = useBase<IProductCombo>({
    path: 'store/product-combo',
    model: ProductCombo,
    initFetch: params?.initFetch
  })

  return hook
}
