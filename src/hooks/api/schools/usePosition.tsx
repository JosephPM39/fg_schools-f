import { IPosition, Position } from '../../../api/models_school'
import { useBase } from '../useBase'

export const usePosition = ({offline}: {offline: boolean}) => {
  const hook = useBase<IPosition>({
    path: 'schools/position',
    offline,
    model: Position
  })

  return hook
}
