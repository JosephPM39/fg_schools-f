import { ICombo, Combo } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useCombo = (params?: Params) => {
  const hook = useBase<ICombo>({
    path: 'store/combo',
    model: Combo,
    initFetch: params?.initFetch
  })

  return hook
}
