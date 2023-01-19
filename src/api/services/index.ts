import { IBaseModel } from "../models_school/base.model";
import {validateDto, validateIdBy, validateQuery} from '../validations'
import { EXPOSE_VERSIONS as EV, ModelClassType, QueryUsed } from '../types'
import { ApiRequest } from "./apiRequest";
import { IQuery } from "../validations/query"
import { LocalRequest } from "./localRequest";
import { isSearchById } from "./types";
import { instanceToPlain } from "class-transformer";

interface BaseParams {
  path: string
  offline: boolean
}

export interface CreateParams<Model> extends BaseParams {
  data: Model[] | Model
  model: ModelClassType<Model>
}

export interface ReadParams<Model extends IBaseModel> extends BaseParams {
  model: ModelClassType<Model>
  query?: IQuery
  searchBy?: Omit<Partial<Model>, 'id'> | Pick<Model, 'id'>
}

interface GoOfflineParams<Model extends IBaseModel> {
  limit: number | 'NONE'
  path: string
}

export class StorageRequest<Model extends IBaseModel> {

  private local = new LocalRequest<Model>()
  private api = new ApiRequest<Model>()

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
    return this.local.create({path, data})
  }

  // To go offline, fetch entity, the lenght of fetch will be pass as parameter (limit)
  goOffline = async ({path, limit}: GoOfflineParams<Model>) => {
    const res = await this.api.get({
      path,
      query: {
        limit: String(limit)
      }
    })
    if (res && res.data) {
      this.local.set(path, res.data)
    }
  }

  // To go online, this method will make a post with localStorage data with offline: true flag
  goOnline = async () => {
    this.local.destroy()
  }

  read = async (params: ReadParams<Model>) => {
    const { query: dto, searchBy: sb, model, path } = params
    const query = dto ? await validateQuery(dto) : undefined
    const searchBy = instanceToPlain(
      await validateIdBy({searchBy: sb, model, version: EV.GET }),
      {
        exposeUnsetFields: false
      }
    ) as Partial<Model>

    if (!params.offline) {
      if (!searchBy || isSearchById(searchBy)) {
        return await this.api.get({ query, searchBy, path })
      }
      return await this.api.getFiltered({ query, searchBy, path })
    }

    console.log(searchBy,'searchBy')
    return this.local.read({ path, searchBy, query })
  }
}


