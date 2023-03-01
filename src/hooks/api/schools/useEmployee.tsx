import { IEmployee, Employee } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useEmployee = (params?: Params) => {
  const hook = useBase<IEmployee>({
    path: 'schools/employee',
    model: Employee,
    initFetch: params?.initFetch
  })

  return hook
}
