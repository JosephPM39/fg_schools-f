import { CONFIG } from '../../config'
import { IBaseModel } from '../models_school/base.model'
import { QueryUsed } from '../types'
import { PostParams, GetParams, PatchParams, DeleteParams } from './types'
import { removeOfflineFlag, addOfflineFlag, searchByHandler } from './utils'

export const post = async <Model extends IBaseModel>(params: PostParams<Model>) => {
  const data = removeOfflineFlag<Model>(params.data)
  const path = `${CONFIG.schoolsApiUrl}${params.path}`
  const res = await fetch(path, {
    method: 'POST',
    body: JSON.stringify(data)
  })

  return addOfflineFlag<Model>(await res.json())
}

const requests: Array<string> = []

export const get = async <Model extends IBaseModel>(params: GetParams) => {

  const { id } = searchByHandler(params.searchBy)
  const searchParams = new URLSearchParams(params.query)
  const path = `${CONFIG.schoolsApiUrl}${params.path}/${id}${searchParams}`

  if (requests.includes(path)) {
    // console.log('Errors, ', requests)
    return undefined
  }
  requests.push(path)

  const res = await fetch(path)

  const index = requests.findIndex((e) => e === path)
  // console.log('elemetns to delete ', requests[index])
  delete requests[index]
  // console.log('elemetns deleted', requests[index])

  const json = await res.json()

  return {
    data: addOfflineFlag<Model>(json.data),
    queryUsed: json.queryUsed as QueryUsed
  }
}

export const getFiltered = async <Model extends IBaseModel>(params: GetParams) => {
  const { body } = searchByHandler(params.searchBy)
  const searchParams = new URLSearchParams(params.query)
  const path = `${CONFIG.schoolsApiUrl}${params.path}/get-filtered${searchParams}`

  if (requests.includes(path)) {
    // console.log('Errors, ', requests)
    return undefined
  }
  requests.push(path)

  const res = await fetch(path, {
    method: 'POST',
    body
  })
  const index = requests.findIndex((e) => e === path)
  // console.log('elemetns to delete ', requests[index])
  delete requests[index]
  // console.log('elemetns deleted', requests[index])

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
