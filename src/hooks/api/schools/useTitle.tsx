import { ITitle, Title } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useTitle = () => {
  const hook = useBase<ITitle>({
    path: 'schools/title',
    model: Title
  })

  return hook
}
