import { instanceToPlain } from 'class-transformer'
import { CONFIG } from '../../config'
import { IBaseModel } from '../models_school/base.model'
import { QueryUsed } from '../types'
import { PostParams, GetParams, PatchParams, DeleteParams } from './types'
import { removeOfflineFlag, addOfflineFlag, searchByHandler } from './utils'
import { fetchOnce } from './utils'

export const post = async <Model extends IBaseModel>(params: PostParams<Model>) => {
  const data = removeOfflineFlag<Model>(params.data)
  const path = `${CONFIG.schoolsApiUrl}${params.path}`
  const res = await fetch(path, {
    method: 'POST',
    body: JSON.stringify(data)
  })

  return addOfflineFlag<Model>(await res.json())
}

export const get = async <Model extends IBaseModel>(params: GetParams) => {
  const query = instanceToPlain(params.query, {
    exposeUnsetFields: false
  })
  const { id } = searchByHandler(params.searchBy)
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

export const getFiltered = async <Model extends IBaseModel>(params: GetParams) => {
  const query = instanceToPlain(params.query, {
    exposeUnsetFields: false
  })
  const { body } = searchByHandler(params.searchBy)
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

export const patch = async <Model>(params: PatchParams<Model>) => {
  const path = `${CONFIG.schoolsApiUrl}${params.path}${params.id}`
  const res = await fetch(path, {
    method: 'PATCH',
    body: JSON.stringify(params.data)
  })

  return res.body
}

export const deleteF = async (params: DeleteParams) => {
  const path = `${CONFIG.schoolsApiUrl}${params.path}${params.id}`
  const res = await fetch(path, {
    method: 'PATCH',
  })

  return res.body
}
