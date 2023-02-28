import { IProductOrder, ProductOrder } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useProductPerOrder = () => {
  const hook = useBase<IProductOrder>({
    path: 'store/product-order',
    model: ProductOrder
  })

  return hook
}
