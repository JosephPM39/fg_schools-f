import { ISchool, School } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useSchool = () => {
  const hook = useBase<ISchool>({
    path: 'schools/school',
    model: School
  })

  return hook
}
