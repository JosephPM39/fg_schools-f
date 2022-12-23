import { IEmployee, Employee } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useEmployee = ({offline}: {offline: boolean}) => {
  const hook = useBase<IEmployee>({
    path: 'schools/employee',
    offline,
    model: Employee
  })

  return hook
}
