import { useEffect, useState } from 'react'
import { ISchoolProm, SchoolProm } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useSchoolProm = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear())

  const hook = useBase<ISchoolProm>({
    path: 'schools/school-prom',
    model: SchoolProm,
    autoFetch: false
  })

  useEffect(() => {
    hook.fetch({searchBy: { year }})
  }, [year])

  return {
    ...hook,
    year,
    setYear
  }
}
