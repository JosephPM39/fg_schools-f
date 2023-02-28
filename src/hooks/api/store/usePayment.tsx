import { IPayment, Payment } from '../../../api/models_school'
import { useBase } from '../useBase'

export const usePayment = () => {
  const hook = useBase<IPayment>({
    path: 'store/payment',
    model: Payment
  })

  return hook
}
