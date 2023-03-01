import { IGroup, Group } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useGroup = (params?: Params) => {
  const hook = useBase<IGroup>({
    path: 'schools/group',
    model: Group,
    initFetch: params?.initFetch
  })

  return hook
}
