import { Border, IBorder } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useBorder = () => {
  const hook = useBase<IBorder>({
    path: 'products/border',
    model: Border
  })

  return hook
}
