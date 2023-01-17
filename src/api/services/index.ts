import { IBaseModel } from "../models_school/base.model";
import {validateDto, validateIdBy, validateQuery} from '../validations'
import { EXPOSE_VERSIONS as EV, ModelClassType, QueryUsed } from '../types'
import { ApiRequest } from "./apiRequest";
import { IQuery } from "../validations/query"
import { filterBy, queryFilter } from './utils'
import { LocalRequest } from "./localRequest";

interface BaseParams<Model> {
  path: string
  offline: boolean
}

export interface CreateParams<Model> extends BaseParams<Model> {
  data: Model[] | Model
  model: ModelClassType<Model>
}

export interface ReadParams<Model extends IBaseModel> extends BaseParams<Model> {
  model: ModelClassType<Model>
  query?: IQuery
  searchBy: Omit<Partial<Model>, 'id'> | Pick<Model, 'id'>
}

export class StorageRequest<Model extends IBaseModel> {

  local = new LocalRequest<Model>()
  api = new ApiRequest<Model>()

  create = async (params: CreateParams<Model>) => {
    const { data: dto, model, path } = params
    const data = await validateDto<Model>({
      dto: dto,
      model: model,
      version: EV.CREATE
    })

    if (!params.offline) {
      const res = await this.api.post({ path, data })
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
  goOffline = () => {}

  // To go online, this method will make a post with localStorage data with offline: true flag
  goOnline = () => {}

  read = async (params: ReadParams<Model>) => {
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
        return await this.api.getFiltered({ query, searchBy, path })
      }
      return await this.api.get({ query, searchBy: id, path })
    }

    if (searchBy) {
      return this.local.read(path, searchBy, query)
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
}


