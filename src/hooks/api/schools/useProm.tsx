import { useEffect, useState } from 'react'
import { IProm, Prom } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useProm = ({offline}: {offline: boolean}) => {
  const [year, setYear] = useState<number>(new Date().getFullYear())

  const hook = useBase<IProm>({
    path: 'schools/prom',
    offline,
    model: Prom,
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
