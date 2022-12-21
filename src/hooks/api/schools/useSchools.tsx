import { ISchool, School } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useSchools = ({offline}: {offline: boolean}) => {
  const hook = useBase<ISchool>({
    path: 'schools/school',
    offline,
    model: School
  })

  return hook
}
