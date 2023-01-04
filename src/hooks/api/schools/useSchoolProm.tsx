import { useEffect, useState } from 'react'
import { ISchoolProm, SchoolProm } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useSchoolProm = ({offline}: {offline: boolean}) => {
  const [year, setYear] = useState<number>(new Date().getFullYear())

  const hook = useBase<ISchoolProm>({
    path: 'schools/school-prom',
    offline,
    model: SchoolProm,
    autoFetch: false
  })

  useEffect(() => {
    if (hook.data && hook.data.length < 1) {
      hook.fetch({searchBy: { year }})
    }
  })

  return {
    ...hook,
    year,
    setYear
  }
}
