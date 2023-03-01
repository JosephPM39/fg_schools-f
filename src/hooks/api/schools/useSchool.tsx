import { ISchool, School } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useSchool = (params?: Params) => {
  const hook = useBase<ISchool>({
    path: 'schools/school',
    model: School,
    initFetch: params?.initFetch
  })

  return hook
}
