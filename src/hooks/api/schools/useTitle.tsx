import { ITitle, Title } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useTitle = (params?: Params) => {
  const hook = useBase<ITitle>({
    path: 'schools/title',
    model: Title,
    initFetch: params?.initFetch
  })

  return hook
}
