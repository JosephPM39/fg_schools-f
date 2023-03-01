import { Type, IType } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useType = (params?: Params) => {
  const hook = useBase<IType>({
    path: 'products/type',
    model: Type,
    initFetch: params?.initFetch
  })

  return hook
}
