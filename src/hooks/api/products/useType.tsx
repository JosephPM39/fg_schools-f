import { Type, IType } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useType = () => {
  const hook = useBase<IType>({
    path: 'products/type',
    model: Type
  })

  return hook
}
