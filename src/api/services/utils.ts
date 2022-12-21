import { IBaseModel } from '../models_school/base.model'
import { IQuery } from '../validations/query'
import { Data } from './types'

export const removeOfflineFlag = <Model extends IBaseModel>(data: Data<Model>): Model[] | Model => {
  if (!Array.isArray(data)) {
    delete data.offline
    return data
  }

  return data.map((dto) => {
    delete dto.offline
    return dto
  })
}

export const addOfflineFlag = <Model extends IBaseModel>(data: Data<Model>, offlineFlagValue: boolean = false): Model[] | undefined => {
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

export const getHeaders = (token?: string) => new Headers({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
})

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

export const queryFilter = <Model extends IBaseModel>(json: Model[], query: IQuery | undefined) => {
  if (query) {
    const { offset, limit } = query
    if (offset && limit) {
      return json.slice(parseInt(offset), (parseInt(limit) + parseInt(offset)))
    }
    if (offset) {
      return json.slice(parseInt(offset))
    }
    if (limit) {
      return json.slice(0, parseInt(limit))
    }
  }
  return json
}

export const filter = <Model extends IBaseModel>(json: Model[], searchBy: Model) => {
  return json.filter((obj) => {
    const keys = Object.keys(searchBy)
    const res = keys.filter(
      (key) => {
        if(key in obj) return !!obj[key as keyof typeof obj]
        return false
      }
    )
    return res.length === keys.length
  })
}

