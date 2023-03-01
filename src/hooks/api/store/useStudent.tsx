import { IStudent, Student } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useStudent = (params?: Params) => {
  const hook = useBase<IStudent>({
    path: 'store/student',
    model: Student,
    initFetch: params?.initFetch
  })

  return hook
}
