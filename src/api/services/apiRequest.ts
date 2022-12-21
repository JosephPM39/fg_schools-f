import { CONFIG } from '../../config'
import { IBaseModel } from '../models_school/base.model'
import { PostParams, GetParams, PatchParams, DeleteParams } from './types'
import { removeOfflineFlag, addOfflineFlag, getHeaders, searchByHandler } from './utils'

export const post = async <Model extends IBaseModel>(params: PostParams<Model>) => {
  const data = removeOfflineFlag<Model>(params.data)
  const path = `${CONFIG.schoolsApiUrl}${params.path}`
  const res = await fetch(path, {
    method: 'POST',
    headers: getHeaders(params.token),
    body: JSON.stringify(data)
  })

  return addOfflineFlag<Model>(await res.json())
}

export const get = async <Model extends IBaseModel>(params: GetParams) => {
  const { id } = searchByHandler(params.searchBy)
  const searchParams = new URLSearchParams(params.query)
  const path = `${CONFIG.schoolsApiUrl}${params.path}${id}${searchParams}`

  const headers = getHeaders(params.token)
  const res = await fetch(path, {
    headers: getHeaders(params.token),
  })

  return addOfflineFlag<Model>(await res.json())
}

export const getFiltered = async <Model extends IBaseModel>(params: GetParams) => {
  const { body } = searchByHandler(params.searchBy)
  const searchParams = new URLSearchParams(params.query)
  const path = `${CONFIG.schoolsApiUrl}${params.path}/get-filtered${searchParams}`

  const headers = getHeaders(params.token)
  const res = await fetch(path, {
    method: 'POST',
    headers: getHeaders(params.token),
    body
  })

  return addOfflineFlag<Model>(await res.json())
}

export const patch = async <Model>(params: PatchParams<Model>) => {
  const path = `${CONFIG.schoolsApiUrl}${params.path}${params.id}`
  const res = await fetch(path, {
    method: 'PATCH',
    headers: getHeaders(params.token),
    body: JSON.stringify(params.data)
  })

  return res.body
}

export const deleteF = async (params: DeleteParams) => {
  const path = `${CONFIG.schoolsApiUrl}${params.path}${params.id}`
  const res = await fetch(path, {
    method: 'PATCH',
    headers: getHeaders(params.token)
  })

  return res.body
}
