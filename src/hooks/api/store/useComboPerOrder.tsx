import { IComboOrder, ComboOrder } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useComboPerOrder = (params?: Params) => {
  const hook = useBase<IComboOrder>({
    path: 'store/combo-order',
    model: ComboOrder,
    initFetch: params?.initFetch
  })

  return hook
}
