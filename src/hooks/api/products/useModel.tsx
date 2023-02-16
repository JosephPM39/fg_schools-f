import { Model, IModel } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useModel = () => {
  const hook = useBase<IModel>({
    path: 'products/model',
    model: Model
  })

  return hook
}
