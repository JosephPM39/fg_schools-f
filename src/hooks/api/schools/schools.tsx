import { useEffect, useState } from 'react'
import { create as apiCreate, read, CreateParams, ReadParams } from '../../../api/services'
import { ISchool, School } from '../../../api/models_school'
import { SessionContext } from '../../../context/SessionContext'

export const useSchools = () => {
  const [schools, setSchools] = useState<ISchool[]>([])

  const baseParams = {
    path: 'schools/school',
    offline: false,
    hook: {
      data: schools,
      set: setSchools
    },
    model: School
  }

  useEffect(() => {
    if (schools.length < 1) {
      fetch({})
    }
  })

  const create = ({data, token}: Pick<CreateParams<ISchool>, 'data' | 'token'>) => apiCreate<ISchool>({
    data,
    token,
    ...baseParams
  })

  const fetch = async ({query, searchBy, token}: Pick<ReadParams<ISchool>, 'query' | 'searchBy' | 'token'>) => {
    const res = await read<ISchool>({
      query,
      searchBy,
      token,
      ...baseParams
    })
    setSchools(res ?? [])
  }

  return {
    schools,
    create,
  }
}
