import { Model, IModel } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useModel = (params?: Params) => {
  const hook = useBase<IModel>({
    path: 'products/model',
    model: Model,
    initFetch: params?.initFetch
  })

  return hook
}
