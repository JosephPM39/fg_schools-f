import { IEmployeePosition, EmployeePosition } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useEmployeePosition = () => {
  const hook = useBase<IEmployeePosition>({
    path: 'schools/employee-position',
    model: EmployeePosition
  })

  return hook
}
