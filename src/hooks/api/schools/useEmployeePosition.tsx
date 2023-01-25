import { IEmployeePosition, EmployeePosition } from '../../../api/models_school'
import { useBase } from '../useBase'
import { useEmployee } from './useEmployee'
import { usePosition } from './usePosition'

interface FetchDepends {
  usePosition: ReturnType<typeof usePosition>
  useEmployee: ReturnType<typeof useEmployee>
}

export const useEmployeePosition = () => {
  const hook = useBase<IEmployeePosition>({
    path: 'schools/employee-position',
    model: EmployeePosition
  })

  const fetchDepends = async ({ useEmployee, usePosition }: FetchDepends) => {
    const res = await Promise.all(hook.data.map(async (ep) => ({
      ...ep,
      employee: await useEmployee.findOne({id: ep.employeeId}),
      position: await usePosition.findOne({id: ep.positionId}),
    })))
    console.log(res.length, 'res', hook.data.length, 'pre')
    hook.setData(res)
  }

  return {
    ...hook,
    fetchDepends
  }
}
