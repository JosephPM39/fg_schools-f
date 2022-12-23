import { ITitle, Title } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useTitle = ({offline}: {offline: boolean}) => {
  const hook = useBase<ITitle>({
    path: 'schools/title',
    offline,
    model: Title
  })

  return hook
}
