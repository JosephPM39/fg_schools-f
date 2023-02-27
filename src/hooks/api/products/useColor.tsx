import { Color, IColor } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useColor = () => {
  const hook = useBase<IColor>({
    path: 'products/color',
    model: Color
  })

  return hook
}
