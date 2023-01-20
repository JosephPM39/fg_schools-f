import { IBaseModel } from '../models_school/base.model'
import { QueryUsed } from '../types'
import { ByOperator, IQuery, Order } from '../validations/query'

const requests: Array<string> = []

export const fetchOnce = async (input: RequestInfo, init?: RequestInit) => {
  const request = `${input.toString()}${init?.toString()}`
  if (requests.includes(request)) {
    return undefined
  }
  requests.push(request)

  const response = await fetch(input, init)

  const index = requests.findIndex((e) => e === request)
  delete requests[index]
  return response
}

export const removeOfflineFlag = <Model extends IBaseModel>(data: Model | Model[]): Model[] | Model => {
  if (!Array.isArray(data)) {
    delete data.offline
    return data
  }

  return data.map((dto) => {
    delete dto.offline
    return dto
  })
}

export const addOfflineFlag = <Model extends IBaseModel>(data: Model | Model[], offlineFlagValue: boolean = false): Model[] | undefined => {
  if (!data) return undefined
  if (!Array.isArray(data)) {
    if (Object.values(data).length < 1) return []
    return [{
      ...data,
      offline: offlineFlagValue
    }]
  }

  if (data.length < 1) return []
  return data.map((dto) => ({
    ...dto,
    offline: offlineFlagValue
  }))
}

export const searchByHandler = (sby?: string | object) => {
  const baseRes = { id: '', body: undefined }

  if (!sby) return baseRes

  if (typeof sby === 'object') {
    return {
      ...baseRes,
      body: JSON.stringify(sby)
    }
  }
  return {
    ...baseRes,
    id: sby
  }
}

export const queryFilter = <Model extends IBaseModel>(json: Model[], query?: IQuery): {
  data: Model[] | undefined,
  queryUsed: QueryUsed
} => {
  const filt: Required<IQuery> = {
    limit: query?.limit ?? '10',
    offset: query?.offset ?? '0',
    byoperator: query?.byoperator ?? ByOperator.equal,
    order: query?.order ?? Order.desc
  }
  const queryUsed = {
    ...filt,
    count: json.length
  }
  if (filt.limit === 'NONE') {
    return {
      data: json.slice(parseInt(filt.offset)),
      queryUsed
    }
  }
  return {
    data: json.slice(parseInt(filt.offset), (parseInt(filt.limit) + parseInt(filt.offset))),
    queryUsed
  }
}

export const filterBy = <Model extends IBaseModel>(json: Model[], searchBy: Partial<Model>) => {
  return json.filter((obj) => {
    const keys = Object.keys(searchBy)
    const res = keys.filter(
      (key) => {
        return obj[key as keyof typeof obj] === searchBy[key as keyof typeof searchBy]
      }
    )
    return res.length === keys.length
  })
}
