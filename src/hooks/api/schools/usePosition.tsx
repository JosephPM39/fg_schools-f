import { IPosition, Position } from '../../../api/models_school'
import { useBase } from '../useBase'

export const usePosition = () => {
  const hook = useBase<IPosition>({
    path: 'schools/position',
    model: Position
  })

  return hook
}
