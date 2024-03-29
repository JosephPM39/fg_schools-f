import { IBaseModel } from '../models_school/base.model'
import { validateDto, validateIdBy, validateQuery } from '../validations'
import { EXPOSE_VERSIONS as EV, ModelClassType, QueryUsed } from '../types'
import { ApiRequest, LocalRequest } from './data'
import {
  isSearchById, SearchBy, SearchById,
  ReadParams,
  PostParams as CreateParams,
  PatchParams as UpdateParams,
  DeleteParams
} from './types'
import { instanceToPlain } from 'class-transformer'
import { ErrorCatched, promiseCatchError } from '../handlers/errors'

interface GoOfflineParams {
  limit: number | 'NONE'
}

export interface StorageRequestConfig<Model extends IBaseModel> {
  model: ModelClassType<Model>
  path: string
  offline: boolean
}

interface Crud<Model extends IBaseModel> {
  read: (p: ReadParams<Model>) => Promise<{
    data: Model[] | null
    queryUsed: QueryUsed<Model>
  }>
  create: (p: CreateParams<Model>) => Promise<Model[]>
  update: (p: UpdateParams<Model>) => Promise<true>
  delete: (p: DeleteParams<Model>) => Promise<true>

  safeRead: (p: ReadParams<Model>) => Promise<{
    data: Model[] | null
    queryUsed: QueryUsed<Model>
  } | ErrorCatched>
  safeCreate: (p: CreateParams<Model>) => Promise<Model[] | ErrorCatched>
  safeUpdate: (p: UpdateParams<Model>) => Promise<true | ErrorCatched>
  safeDelete: (p: DeleteParams<Model>) => Promise<true | ErrorCatched>

}

interface ValidateParams<Model extends IBaseModel> {
  data: CreateParams<Model>['data']
  version?: EV
}

export class StorageRequest<Model extends IBaseModel> implements Crud<Model> {
  private readonly local = new LocalRequest<Model>(this.config.path)
  private readonly api = new ApiRequest<Model>(this.config.path)

  // eslint-disable-next-line @typescript-eslint/space-before-function-paren
  constructor(
    private readonly config: StorageRequestConfig<Model>
  ) { }

  validate = async ({ data: dto, version = EV.CREATE }: ValidateParams<Model>) => {
    if (Array.isArray(dto)) {
      const data = await Promise.all(dto.map(async (item) => {
        return await validateDto<Model>({
          model: this.config.model,
          dto: item,
          version
        })
      }))
      return data
    }
    const data = await validateDto<Model>({
      model: this.config.model,
      dto,
      version
    })
    return data
  }

  create = async (params: CreateParams<Model>) => {
    const { data: dto } = params
    const { offline } = this.config
    const data = await this.validate({
      data: dto,
      version: EV.CREATE
    })

    if (!offline) {
      const res = await this.api.post({ data })
      if (!res) throw new Error('No se pudo crear')
      return res
    }
    const res = await this.local.create({ data })
    if (!res) throw new Error('No se pudo crear')
    return res
  }

  // To go offline, fetch entity, the lenght of fetch will be pass as parameter (limit)
  goOffline = async ({ limit }: GoOfflineParams) => {
    const { path } = this.config
    const res = await this.api.get({
      query: {
        limit: String(limit)
      }
    })
    if (res?.data) {
      this.local.set(path, res.data)
    }
  }

  // To go online, this method will make a post with localStorage data with offline: true flag
  goOnline = async () => {
    this.local.destroy()
  }

  read = async (params: ReadParams<Model>) => {
    const { query: dto, searchBy: sb } = params
    const { model, offline } = this.config
    const query = dto ? await validateQuery(dto) : undefined
    const searchBy = instanceToPlain(
      await validateIdBy({ searchBy: sb, model, version: EV.GET }),
      {
        exposeUnsetFields: false
      }
    ) as SearchById<Model> | SearchBy<Model>

    if (offline) return await this.local.read({ searchBy, query })

    if (!searchBy || isSearchById(searchBy)) {
      return await this.api.get({ searchBy, query })
    }
    return await this.api.getFiltered({ searchBy, query })
  }

  isOfflineRegister = async ({ id }: { id: Model['id'] }) => {
    const res = await this.local.read({ searchBy: { id } })
    return (!!res.data?.[0].offline)
  }

  update = async (params: UpdateParams<Model>) => {
    const { data: dto, id } = params
    const { model, offline } = this.config
    const data = await validateDto<Model>({
      dto,
      model,
      version: EV.UPDATE
    })

    const config = { id, data }

    if (offline) {
      if (!this.isOfflineRegister({ id })) {
        throw new Error('No se puede actualizar un registro Online')
      }

      const res = await this.local.patch(config)
      if (!res) { throw new Error('No se pudo actualizar') }
      return res
    }

    const res = await this.api.patch(config)
    if (!res) { throw new Error('No se pudo actualizar') }
    return res
  }

  delete = async (params: DeleteParams<Model>) => {
    const { id } = params
    const { offline } = this.config

    if (offline) {
      if (!this.isOfflineRegister({ id })) {
        throw new Error('No se puede eliminar un registro Online')
      }
      const res = await this.local.delete({ id })
      if (!res) { throw new Error('No se pudo eliminar') }
      return res
    }

    const res = await this.api.delete({ id })
    if (!res) { throw new Error('No se pudo eliminar') }
    return res
  }

  safeCreate = async (p: CreateParams<Model>) => await promiseCatchError(this.create, p)
  safeUpdate = async (p: UpdateParams<Model>) => await promiseCatchError(this.update, p)
  safeDelete = async (p: DeleteParams<Model>) => await promiseCatchError(this.delete, p)
  safeRead = async (p: ReadParams<Model>) => await promiseCatchError(this.read, p)
}
