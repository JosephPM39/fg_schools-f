import { IBaseModel } from '../models_school/base.model'
import { QueryUsed } from '../types'
import { ByOperator, IQuery, Order } from '../validations/query'
import { ResponseError, Responses, Status } from '../handlers/errors'

const requests: string[] = []
let promises: {
  [key: string]: Promise<Response>
} = {}

export const fetchOnce = async (input: RequestInfo, init?: RequestInit) => {
  const request = `${JSON.stringify(input)}${JSON.stringify(init ?? '')}`
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

  // eslint-disable-next-line
  delete requests[index]
  // eslint-disable-next-line
  delete promises[request]
  return response
}

export const toPromise = async <T extends (...any: any) => any>(
  cb: T,
  p: Parameters<T>
) => await new Promise<ReturnType<T>>((resolve, reject) => {
  try {
    console.log('fetching')
    setTimeout(() => resolve(cb(p)), 0)
  } catch (e) {
    reject(e)
  }
})

export const throwApiResponseError = (status: number) => {
  const st: Status = Object
    .keys(Responses).includes(String(status))
    ? status as Status
    : 999
  throw new ResponseError(Responses[st])
}

export const getFileExtension = (filename: string) => {
  const split = filename.split('.')
  if (split.length < 2) return ''
  return split.pop() ?? ''
}

export const debounce = async <T extends (...any: any) => any>(
  cb: T,
  p: Parameters<T>,
  time: number = 50
) => {
  return await new Promise<ReturnType<T>>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(cb(p))
      } catch (e) {
        reject(e)
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

interface MakeGetFilteredParams<Model extends IBaseModel> {
  json: Model[]
  query?: IQuery
  searchBy: Partial<Model>
}

interface MakeGetFilteredReturn<Model extends IBaseModel> {
  data: Model[] | null
  queryUsed: QueryUsed<Model>
}

export const makeGetFiltered = <
  Model extends IBaseModel
>(params: MakeGetFilteredParams<Model>): MakeGetFilteredReturn<Model> => {
  const { query, searchBy, json: data } = params

  const finalQuery: Required<IQuery> = {
    limit: query?.limit ?? '10',
    offset: query?.offset ?? '0',
    byoperator: query?.byoperator ?? ByOperator.equal,
    order: query?.order ?? Order.desc
  }

  const json = filterBy(data, searchBy, finalQuery.byoperator)

  const queryUsed = {
    ...finalQuery,
    count: json.length
  }
  if (finalQuery.limit === 'NONE') {
    return {
      data: json.slice(parseInt(finalQuery.offset)),
      queryUsed
    }
  }
  return {
    data: json.slice(parseInt(finalQuery.offset), (parseInt(finalQuery.limit) + parseInt(finalQuery.offset))),
    queryUsed
  }
}

export const queryFilter = <Model extends IBaseModel>(json: Model[], query?: IQuery): {
  data: Model[] | null
  queryUsed: QueryUsed<Model>
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

export const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export const addslashes = (str: string) => {
  //  discuss at: https://locutus.io/php/addslashes/
  // original by: Kevin van Zonneveld (https://kvz.io)
  // improved by: Ates Goral (https://magnetiq.com)
  // improved by: marrtins
  // improved by: Nate
  // improved by: Onno Marsman (https://twitter.com/onnomarsman)
  // improved by: Brett Zamir (https://brett-zamir.me)
  // improved by: Oskar Larsson Högfeldt (https://oskar-lh.name/)
  //    input by: Denny Wardhana
  //   example 1: addslashes("kevin's birthday")
  //   returns 1: "kevin\\'s birthday"
  return (str + '')
    .replace(/[\\"']/g, '\\$&')
    .replace(/\u0000/g, '\\0')
}

const likeToReg = (likeExp: string) => {
  const regExp = addslashes(likeExp).replace('%', '.*').replace('_', '.')
  const regExpEscaped = escapeRegExp(`^${regExp}$`)
  console.log('reg: ')
  return regExpEscaped
}

export const filterBy = <Model extends IBaseModel>(json: Model[], searchBy: Partial<Model>, byoperator?: ByOperator) => {
  const equal = (value: any, searchValue: any) => value === searchValue
  const moreThan = (value: number, searchValue: number) => value > searchValue
  const lessThan = (value: number, searchValue: number) => value < searchValue
  const notEqual = (value: any, searchValue: any) => !equal(value, searchValue)
  const like = (value: string, searchValue: string) => {
    const res = new RegExp(likeToReg(searchValue)).test(value)
    console.log(value, ' M ', searchValue, ' = ', res)
    return res
  }
  const ilike = (value: string, searchValue: string) => (
    like(value.toUpperCase(), searchValue.toUpperCase())
  )

  const operator = (value: any, searchValue: any) => {
    if (byoperator === ByOperator.like) return like(value, searchValue)
    if (byoperator === ByOperator.iLike) return ilike(value, searchValue)
    if (byoperator === ByOperator.equal) return equal(value, searchValue)
    if (byoperator === ByOperator.notEqual) return notEqual(value, searchValue)
    if (byoperator === ByOperator.moreThan) return moreThan(value, searchValue)
    if (byoperator === ByOperator.lessThan) return lessThan(value, searchValue)
    return equal(value, searchValue)
  }

  return json.filter((obj) => {
    const keys = Object.keys(searchBy)
    const res = keys.filter(
      (key) => {
        return operator(obj[key as keyof typeof obj], searchBy[key as keyof typeof searchBy])
      }
    )
    return res.length === keys.length
  })
}
