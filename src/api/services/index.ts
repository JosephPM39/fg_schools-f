import { IBaseModel } from "../models_school/base.model";
import {validateDto, validateIdBy, validateQuery} from '../validations'
import { EXPOSE_VERSIONS as EV, ModelClassType } from '../types'
import { post, get } from "./apiRequest";
import { IQuery } from "../validations/query"
import { filter, queryFilter } from './utils'

interface BaseParams<Model> {
  path: string
  token: string
  offline: boolean
  hook: {
    data: Model[]
    set: React.Dispatch<React.SetStateAction<Model[]>>
  }
}

export interface CreateParams<Model> extends BaseParams<Model> {
  data: Model
  model: ModelClassType<Model>
}

export interface ReadParams<Model> extends BaseParams<Model> {
  model: ModelClassType<Model>
  query?: IQuery
  searchBy?: string | Model
}

export const create = async <Model extends IBaseModel>(params: CreateParams<Model>) => {
  const { data: dto, model, path, token } = params
  const data = await validateDto<Model>({
    dto: dto,
    model: model,
    version: EV.CREATE
  })

  if (!params.offline) {
    const res = await post<Model>({ path, token, data })
    if (!res) throw new Error('Falló la operación')
    params.hook.data.push(res[0])
  }

  if (params.offline) {
    params.hook.data.push(data)
    window.localStorage.removeItem(path)
    window.localStorage.setItem(path, JSON.stringify(params.hook.data))
  }
}

export const read = async <Model extends IBaseModel>(params: ReadParams<Model>) => {
  const { query: dto, searchBy: idBy, model, path, token } = params
  const query = dto ? await validateQuery(dto) : undefined
  const searchBy = idBy ? await validateIdBy({ idBy, model, version: EV.GET }) : undefined

  if (!params.offline) {
    const res = await get<Model>({ query, searchBy, path, token})
    params.hook.set(res)
  }

  if (params.offline) {
    const res = window.localStorage.getItem(path)
    if (!res) return
    let json : Model[] = JSON.parse(res)

    if (searchBy) {
      json = [...filter(json, searchBy) ]
    }

    if (query) {
      json = [...queryFilter(json, query)]
    }
    params.hook.set(json)
  }
}
