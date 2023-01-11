import { IEmployee, Employee } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useEmployee = () => {
  const hook = useBase<IEmployee>({
    path: 'schools/employee',
    model: Employee
  })

  return hook
}
