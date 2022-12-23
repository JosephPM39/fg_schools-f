import { IGroup, Group } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useGroup = ({offline}: {offline: boolean}) => {
  const hook = useBase<IGroup>({
    path: 'schools/group',
    offline,
    model: Group
  })

  return hook
}
