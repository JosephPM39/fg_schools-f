import { IComboOrder, ComboOrder} from '../../../api/models_school'
import { useBase } from '../useBase'

export const useComboPerOrder = () => {
  const hook = useBase<IComboOrder>({
    path: 'store/combo-order',
    model: ComboOrder
  })

  return hook
}
