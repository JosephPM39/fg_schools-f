import { Order, IOrder } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useOrder = () => {
  const hook = useBase<IOrder>({
    path: 'store/order',
    model: Order
  })

  return hook
}
