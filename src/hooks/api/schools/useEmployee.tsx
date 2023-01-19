import { IEmployee, Employee } from '../../../api/models_school'
import { BaseParams } from './types'
import { useBase } from '../useBase'

export const useEmployee = ({ netStatus }: BaseParams) => {
  const hook = useBase<IEmployee>({
    path: 'schools/employee',
    model: Employee,
    netStatus
  })

  return hook
}
