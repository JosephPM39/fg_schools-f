import { Size, ISize } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useSize = (params?: Params) => {
  const hook = useBase<ISize>({
    path: 'products/size',
    model: Size,
    initFetch: params?.initFetch
  })

  return hook
}
