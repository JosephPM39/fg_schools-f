import { Border, IBorder } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useBorder = (params?: Params) => {
  const hook = useBase<IBorder>({
    path: 'products/border',
    model: Border,
    initFetch: params?.initFetch
  })

  return hook
}
