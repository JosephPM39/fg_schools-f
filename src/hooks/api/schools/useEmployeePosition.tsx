import { IEmployeePosition, EmployeePosition } from '../../../api/models_school'
import { useBase } from '../useBase'
import { useEmployee } from './useEmployee'
import { usePosition } from './usePosition'
import { DefaultApiHookParams as Params } from '../types'

interface FetchDepends {
  usePosition: ReturnType<typeof usePosition>
  useEmployee: ReturnType<typeof useEmployee>
}

export const useEmployeePosition = (params?: Params) => {
  const hook = useBase<IEmployeePosition>({
    path: 'schools/employee-position',
    model: EmployeePosition,
    initFetch: params?.initFetch
  })

  const fetchDepends = async ({ useEmployee, usePosition }: FetchDepends) => {
    const res = await Promise.all(hook.data.map(async (ep) => ({
      ...ep,
      employee: await useEmployee.findOne({id: ep.employeeId}) ?? undefined,
      position: await usePosition.findOne({id: ep.positionId}) ?? undefined,
    })))
    hook.setData(res)
  }

  return {
    ...hook,
    fetchDepends
  }
}
