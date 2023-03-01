import { Order, IOrder } from '../../../api/models_school'
import { useBase } from '../useBase'

type Params = {
  initFetch?: boolean
}

export const useOrder = (params?: Params) => {
  const hook = useBase<IOrder>({
    path: 'store/order',
    model: Order,
    initFetch: params?.initFetch
  })

  return hook
}
