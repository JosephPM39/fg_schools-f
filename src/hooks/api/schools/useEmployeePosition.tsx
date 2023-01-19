import { IEmployeePosition, EmployeePosition } from '../../../api/models_school'
import { useBase } from '../useBase'
import { BaseParams } from './types'

export const useEmployeePosition = ({ netStatus }: BaseParams) => {
  const hook = useBase<IEmployeePosition>({
    path: 'schools/employee-position',
    model: EmployeePosition,
    netStatus
  })

  return hook
}
