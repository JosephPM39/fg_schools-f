import { IStudent, Student } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useStudent = () => {
  const hook = useBase<IStudent>({
    path: 'store/student',
    model: Student
  })

  return hook
}
