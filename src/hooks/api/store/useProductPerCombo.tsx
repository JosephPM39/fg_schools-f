import { IProductCombo, ProductCombo } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useProductPerCombo = () => {
  const hook = useBase<IProductCombo>({
    path: 'store/product-combo',
    model: ProductCombo
  })

  return hook
}
