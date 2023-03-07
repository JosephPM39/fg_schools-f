import { instanceToPlain } from 'class-transformer'
import { CONFIG } from '../../../config'
import { IBaseModel } from '../../models_school/base.model'
import { QueryUsed } from '../../types'
import { PostParams, GetNormalParams, PatchParams, DeleteParams, GetFilteredParams } from '../types'
import { removeOfflineFlag, addOfflineFlag, throwApiResponseError, fetchOnce } from '../utils'

interface Crud<Model extends IBaseModel> {
  get: (p: GetNormalParams<Model>) => Promise<{
    data: Model[] | null,
    queryUsed: QueryUsed
  }>
  getFiltered: (p: GetFilteredParams<Model>) => Promise<{
    data: Model[] | null,
    queryUsed: QueryUsed
  }>
  post: (p: PostParams<Model>) => Promise<Model[] | false>
  patch: (p: PatchParams<Model>) => Promise<boolean>
  delete: (p: DeleteParams<Model>) => Promise<boolean>
}

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
  }
}

export class ApiRequest<Model extends IBaseModel> implements Crud<Model> {
  constructor(
    private path: string
  ) {}

  post = async (params: PostParams<Model>) => {
    const data = removeOfflineFlag<Model>(params.data)
    const path = `${CONFIG.schoolsApiUrl}/${this.path}`
    const res = await fetch(path, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    })

    if (res.status !== 201) throwApiResponseError(res.status)

    return addOfflineFlag<Model>(await res.json()) ?? false
  }

  get = async (params: GetNormalParams<Model>) => {
    const query = instanceToPlain(params.query, {
      exposeUnsetFields: false
    })
    const { id } = params.searchBy ?? { id: '' }
    const searchParams = new URLSearchParams(query)
    const path = `${CONFIG.schoolsApiUrl}/${this.path}/${id}?${searchParams}`

    const res = await fetchOnce(path, {
      headers: getHeaders(),
    })

    if (res.status !== 200) throwApiResponseError(res.status)

    const json = await res.json()

    return {
      data: addOfflineFlag<Model>(json.data) ?? null,
      queryUsed: json.queryUsed as QueryUsed
    }
  }

  getFiltered = async (params: GetFilteredParams<Model>) => {
    const query = instanceToPlain(params.query, {
      exposeUnsetFields: false
    })
    const body = JSON.stringify(removeOfflineFlag({
      ...params.searchBy
    }))
    const searchParams = new URLSearchParams(query)
    const path = `${CONFIG.schoolsApiUrl}/${this.path}/get-filtered?${searchParams}`

    const res = await fetchOnce(path, {
      method: 'POST',
      headers: getHeaders(),
      body
    })

    if (res.status !== 200) throwApiResponseError(res.status)

    const json = await res.json()

    return {
      data: addOfflineFlag<Model>(json.data) ?? null,
      queryUsed: json.queryUsed as QueryUsed
    }
  }

  patch = async (params: PatchParams<Model>) => {
    const path = `${CONFIG.schoolsApiUrl}/${this.path}/${params.id}`
    const res = await fetch(path, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(params.data)
    })

    if (res.status !== 200) throwApiResponseError(res.status)

    return !!res.body
  }

  delete = async (params: DeleteParams<Model>) => {
    const path = `${CONFIG.schoolsApiUrl}/${this.path}/${params.id}`
    const res = await fetch(path, {
      method: 'DELETE',
      headers: getHeaders(),
    })

    if (res.status !== 200) throwApiResponseError(res.status)

    return !!res.body
  }
}
