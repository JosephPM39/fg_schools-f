import { IPayment, Payment } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const usePayment = (params?: Params) => {
  const hook = useBase<IPayment>({
    path: 'store/payment',
    model: Payment,
    initFetch: params?.initFetch
  })

  return hook
}
