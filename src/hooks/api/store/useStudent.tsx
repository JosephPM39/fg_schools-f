import { IStudent, Student } from '../../../api/models_school'
import { useBase } from '../useBase'

type Params = {
  initFetch?: boolean
}

export const useStudent = (params?: Params) => {
  const hook = useBase<IStudent>({
    path: 'store/student',
    model: Student,
    initFetch: params?.initFetch
  })

  return hook
}
