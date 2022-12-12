import { useState } from 'react'
import { create as apiCreate, read, CreateParams, ReadParams } from '../../../api/services'
import { ISchool, School } from '../../../api/models_school'

export const useSchools = () => {
  const [schools, setSchools] = useState<ISchool[]>([])

  const baseParams = {
    token: '',
    path: '',
    offline: false,
    hook: {
      data: schools,
      set: setSchools
    },
    model: School
  }

  const create = ({data}: Pick<CreateParams<ISchool>, 'data'>) => apiCreate<ISchool>({
    data,
    ...baseParams
  })

  const fetch = ({query, searchBy}: Pick<ReadParams<ISchool>, 'query' | 'searchBy'>) => read<ISchool>({
    query,
    searchBy,
    ...baseParams
  })

  return {
    schools,
    create,
    fetch
  }
}
