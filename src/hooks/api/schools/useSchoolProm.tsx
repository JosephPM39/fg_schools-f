import { useEffect, useState } from 'react'
import { ISchoolProm, SchoolProm } from '../../../api/models_school'
import { useBase } from '../useBase'

interface Params {
  autoFetch?: boolean,
  year?: number
}

const defaultParams = {
  autoFetch: true,
  year: new Date().getFullYear()
}

const getParams = (params?: Params): Required<Params> => {
  if (!params) return defaultParams
  const {year, autoFetch} = params
  return {
    year: year ?? defaultParams.year,
    autoFetch: autoFetch ?? defaultParams.autoFetch
  }
}

export const useSchoolProm = (params?: Params) => {
  const {year: yearParam, autoFetch} = getParams(params)
  const [year, setYear] = useState<number>(yearParam)

  const hook = useBase<ISchoolProm>({
    path: 'schools/school-prom',
    model: SchoolProm,
    autoFetch: params?.autoFetch ?? false
  })

  useEffect(() => {
    if (autoFetch) {
      hook.fetch({searchBy: { year }, query: {
        limit: '100'
      }})
    }
  }, [year, autoFetch])

  useEffect(() => {
    if (yearParam) {
      setYear(yearParam)
    }
  }, [yearParam])

  return {
    ...hook,
    year,
    setYear
  }
}
