import { IPosition, Position } from '../../../api/models_school'
import { useBase } from '../useBase'
import { BaseParams } from './types'

export const usePosition = ({ netStatus }: BaseParams) => {
  const hook = useBase<IPosition>({
    path: 'schools/position',
    model: Position,
    netStatus
  })

  return hook
}
