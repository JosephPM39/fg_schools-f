import { ITitle, Title } from '../../../api/models_school'
import { useBase } from '../useBase'
import { BaseParams } from './types'

export const useTitle = ({ netStatus }: BaseParams) => {
  const hook = useBase<ITitle>({
    path: 'schools/title',
    model: Title,
    netStatus
  })

  return hook
}
