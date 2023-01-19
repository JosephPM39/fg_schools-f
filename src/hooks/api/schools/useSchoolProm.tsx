import { useEffect, useState } from 'react'
import { ISchoolProm, SchoolProm } from '../../../api/models_school'
import { useBase } from '../useBase'
import { BaseParams } from './types'

interface UseSchoolPromParams extends BaseParams {
  autoFetch?: boolean,
  year?: number
}

export const useSchoolProm = (params: UseSchoolPromParams) => {
  const [year, setYear] = useState<number>(params?.year ?? new Date().getFullYear())

  const hook = useBase<ISchoolProm>({
    path: 'schools/school-prom',
    model: SchoolProm,
    autoFetch: params?.autoFetch ?? false,
    netStatus: params.netStatus
  })

  useEffect(() => {
    if (params?.autoFetch ?? true) {
      hook.fetch({searchBy: { year }})
    }
  }, [year, params?.autoFetch])

  useEffect(() => {
    if (params?.year) {
      setYear(params?.year)
    }
  }, [params?.year])

  return {
    ...hook,
    year,
    setYear
  }
}
