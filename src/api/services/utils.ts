import { IBaseModel } from '../models_school/base.model'
import { QueryUsed } from '../types'
import { ByOperator, IQuery, Order } from '../validations/query'
import { ResponseError, Responses, Status } from '../handlers/errors'

const requests: Array<string> = []
let promises: {
  [key: string]: Promise<Response>
} = {}

export const fetchOnce = async (input: RequestInfo, init?: RequestInit) => {
  const request = `${input.toString()}${JSON.stringify(init ?? '')}`
  if (requests.includes(request)) {
    const res = await promises[request]
    return res.clone()
    // throw new ResponseError(Responses[102])
  }
  requests.push(request)
  promises = {
    ...promises,
    [request]: fetch(input, init)
  }

  const response = await promises[request]

  const index = requests.findIndex((e) => e === request)
  delete requests[index]
  delete promises[request]
  return response
}

export const throwApiResponseError = (status: number) => {
  const st: Status = Object
    .keys(Responses).includes(String(status)) ? status as Status : 999
  throw new ResponseError(Responses[st])
}

export const getFileExtension = (filename: string) => {
  const split = filename.split('.')
  if (split.length < 2) return ''
  return split.pop() ?? ''
}

export const debounce = <T extends (...any: any) => any>(
  cb: T,
  p: Parameters<T>,
  time: number = 50
) => {
  return new Promise<ReturnType<T>>((res, rej) => {
    setTimeout(() => {
      try {
        res(cb(p))
      }
      catch (e) {
        rej(e)
      }
    }, time)
  })
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

export const addOfflineFlag = <Model extends IBaseModel>(
  data: Model | Model[],
  offlineFlagValue: boolean = false
): Model[] | undefined => {
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
  data: Model[] | null,
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
