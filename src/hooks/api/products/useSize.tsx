import { Size, ISize } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useSize = () => {
  const hook = useBase<ISize>({
    path: 'products/size',
    model: Size
  })

  return hook
}
