import { instanceToPlain } from 'class-transformer'
import { CONFIG } from '../../config'
import { IBaseModel } from '../models_school/base.model'
import { QueryUsed } from '../types'
import { PostParams, GetParams, PatchParams, DeleteParams, GetFilteredParams } from './types'
import { removeOfflineFlag, addOfflineFlag, searchByHandler } from './utils'
import { fetchOnce } from './utils'

export class ApiRequest<Model extends IBaseModel> {
  post = async (params: PostParams<Model>) => {
    const data = removeOfflineFlag<Model>(params.data)
    const path = `${CONFIG.schoolsApiUrl}${params.path}`
    const res = await fetch(path, {
      method: 'POST',
      body: JSON.stringify(data)
    })

    return addOfflineFlag<Model>(await res.json())
  }

  get = async (params: GetParams<Model>) => {
    const query = instanceToPlain(params.query, {
      exposeUnsetFields: false
    })
    const { id } = params.searchBy ?? { id: '' }
    const searchParams = new URLSearchParams(query)
    const path = `${CONFIG.schoolsApiUrl}${params.path}/${id}?${searchParams}`

    const res = await fetchOnce(path)
    if (!res) return
    const json = await res.json()

    return {
      data: addOfflineFlag<Model>(json.data),
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
    const path = `${CONFIG.schoolsApiUrl}${params.path}/get-filtered?${searchParams}`

    const res = await fetchOnce(path, {
      method: 'POST',
      body
    })
    if (!res) return
    const json = await res.json()

    return {
      data: addOfflineFlag<Model>(json.data),
      queryUsed: json.queryUsed as QueryUsed
    }
  }

  patch = async (params: PatchParams<Model>) => {
    const path = `${CONFIG.schoolsApiUrl}${params.path}${params.id}`
    const res = await fetch(path, {
      method: 'PATCH',
      body: JSON.stringify(params.data)
    })

    return res.body
  }

  deleteF = async (params: DeleteParams<Model>) => {
    const path = `${CONFIG.schoolsApiUrl}${params.path}${params.id}`
    const res = await fetch(path, {
      method: 'PATCH',
    })

    return res.body
  }
}
