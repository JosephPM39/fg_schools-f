import { IEmployeePosition, EmployeePosition } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useEmployeePosition = ({offline}: {offline: boolean}) => {
  const hook = useBase<IEmployeePosition>({
    path: 'schools/employee-position',
    offline,
    model: EmployeePosition
  })

  return hook
}
