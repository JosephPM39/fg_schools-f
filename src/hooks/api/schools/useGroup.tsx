import { IGroup, Group } from '../../../api/models_school'
import { useBase } from '../useBase'
import { BaseParams } from './types'

export const useGroup = ({ netStatus }: BaseParams) => {
  const hook = useBase<IGroup>({
    path: 'schools/group',
    model: Group,
    netStatus
  })

  return hook
}
