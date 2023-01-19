import { ISchool, School } from '../../../api/models_school'
import { useBase } from '../useBase'
import { BaseParams } from './types'

export const useSchool = ({ netStatus }: BaseParams) => {
  const hook = useBase<ISchool>({
    path: 'schools/school',
    model: School,
    netStatus
  })

  return hook
}
