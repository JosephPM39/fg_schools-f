import { useEffect, useState } from 'react'
import { ISchoolProm, SchoolProm } from '../../../api/models_school'
import { useBase } from '../useBase'

interface Params {
  year?: number
  initFetch?: boolean
}

const defaultYear = new Date().getFullYear()

export const useSchoolProm = (params?: Params) => {
  const initFetch = params?.initFetch ?? true
  const [year, setYear] = useState<number>(params?.year ?? defaultYear)

  const hook = useBase<ISchoolProm>({
    path: 'schools/school-prom',
    model: SchoolProm,
    initFetch: false
  })

  useEffect(() => {
    if (!initFetch) return
    hook.fetch({ searchBy: { year }})
  }, [year, initFetch])

  return {
    ...hook,
    year,
    setYear
  }
}
