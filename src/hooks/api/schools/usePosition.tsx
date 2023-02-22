import { IPosition, Position } from '../../../api/models_school'
import { useBase } from '../useBase'

type Params = {
  initFetch?: boolean
}

export const usePosition = (params?: Params) => {
  const hook = useBase<IPosition>({
    path: 'schools/position',
    model: Position,
    initFetch: params?.initFetch
  })

  return hook
}
