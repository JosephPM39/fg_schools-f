import { IBaseModel } from "../models_school/base.model";
import {validateDto, validateIdBy, validateQuery} from '../validations'
import { EXPOSE_VERSIONS as EV, ModelClassType, QueryUsed } from '../types'
import { post, get, getFiltered } from "./apiRequest";
import { IQuery } from "../validations/query"
import { filterBy, queryFilter } from './utils'

interface BaseParams<Model> {
  path: string
  offline: boolean
}

export interface CreateParams<Model> extends BaseParams<Model> {
  data: Model
  model: ModelClassType<Model>
}

export interface ReadParams<Model> extends BaseParams<Model> {
  model: ModelClassType<Model>
  query?: IQuery
  searchBy?: string | Partial<Model>
}

export const create = async <Model extends IBaseModel>(params: CreateParams<Model>) => {
  const { data: dto, model, path } = params
  const data = await validateDto<Model>({
    dto: dto,
    model: model,
    version: EV.CREATE
  })

  if (!params.offline) {
    const res = await post<Model>({ path, data })
    if (!res) throw new Error('Falló la operación')
    return res[0]
  }

  if (params.offline) {
    window.localStorage.removeItem(path)
    window.localStorage.setItem(path, JSON.stringify(data))
    return data
  }
}

// To go offline, fetch entity, the lenght of fetch will be pass as parameter (limit)
export const goOffline = () => {}

// To go online, this method will make a post with localStorage data with offline: true flag
export const goOnline = () => {}

export const read = async <Model extends IBaseModel>(params: ReadParams<Model>) => {
  const { query: dto, searchBy: idBy, model, path } = params
  const query = dto ? await validateQuery(dto) : undefined
  const id = (
    typeof idBy === 'string' ? idBy : undefined
  )
  const searchBy = (
    typeof idBy === 'object' ? await validateIdBy({
      idBy, model, version: EV.GET
    }) : undefined
  )

  if (!params.offline) {
    if (searchBy) {
      return await getFiltered<Model>({ query, searchBy, path })
    }
    return await get<Model>({ query, searchBy: id, path })
  }

  if (params.offline) {
    const res = window.localStorage.getItem(path)
    if (!res) return
    let json : { data: Model[], queryUsed: QueryUsed } = JSON.parse(res)

    if (searchBy) {
      json.data = [...filterBy(json.data, searchBy) ]
    }

    if (query) {
      json.data = [...queryFilter(json.data, query)]
    }
    return json
  }
}
