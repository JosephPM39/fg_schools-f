import { IGroup, Group } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useGroup = () => {
  const hook = useBase<IGroup>({
    path: 'schools/group',
    model: Group
  })

  return hook
}
