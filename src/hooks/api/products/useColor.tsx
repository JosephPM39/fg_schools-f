import { Color, IColor } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useColor = (params?: Params) => {
  const hook = useBase<IColor>({
    path: 'products/color',
    model: Color,
    initFetch: params?.initFetch
  })

  return hook
}
