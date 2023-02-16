import { useCallback, useEffect, useMemo, useState } from 'react'
import { StorageRequest, ReadParams, DeleteParams,UpdateParams } from '../../api/services'
import { IBaseModel } from '../../api/models_school/base.model'
import { ModelClassType, QueryUsed } from '../../api/types'
import { filterBy } from '../../api/services/utils'
import { useDebounce } from '../useDebouce'
import { useNetStatus, AppNetStatus } from '../useNetStatus'
import { SearchBy } from '../../api/services/types'

export interface BaseParams<Model extends IBaseModel> {
  path: string
  model: ModelClassType<Model>
  autoFetch?: boolean
}

type FetchParams<Model extends IBaseModel> = {
  mode?: 'clean' | 'merge',
} & ReadParams<Model>

type CreateParams<Model extends IBaseModel> = Model | Model[]

export const useBase = <Model extends IBaseModel>(params: BaseParams<Model>) => {
  // ========== DATA HOOKS ==========
  const [metadata, setMetadata] = useState<QueryUsed | undefined>(undefined)
  const [data, setData] = useState<Model[]>([])

  // ========== HELPER HOOKS ==========
  const { setAppNetStatus, isAppOffline, isAppNetStatus } = useNetStatus()
  const { debounce } = useDebounce()

  // ========== CONFIG ==========
  const { path, autoFetch = true, model } = params
  const [needFetching, setNeedFetching] = useState(true)
  const offline = isAppOffline()
  const storage = useMemo(() => new StorageRequest<Model>({
    path,
    offline,
    model
  }), [path, model, offline])

  // ==========================================
  // ============= READ FUNCTIONS =============
  // ==========================================

  const validate = storage.validate

  const findOneLocal = (id?: Model['id']) => {
    return data.find((e) => e.id === id)
  }

  const findOne = async ({id}: {id?: Model['id']}) => {
    if (!id) return undefined

    const local = findOneLocal(id)
    if (local) return local

    const remote = await storage.read({
      searchBy: { id },
    })
    if (!remote?.data || remote?.data?.length < 1) return undefined

    if (!findOneLocal(id)){
      data.push(...remote.data)
    }
    return remote.data[0]
  }

  const findBy = async (searchBy?: SearchBy<Model>) => {
    if (!searchBy) return undefined

    const local = filterBy<Model>(data, searchBy as Partial<Model>)
    if (local.length > 0) return local

    const remote = await (storage.read({
      searchBy,
    }))
    if (!remote?.data) return undefined
    if(filterBy<Model>(data, searchBy as Partial<Model>).length < 1) {
      data.push(...remote.data)
    }
    setMetadata(remote.queryUsed)
    return remote.data
  }

  const fetchF = async (params: FetchParams<Model>) => {
    const { query, searchBy, mode = 'clean' } = params
    const res = await (storage.read({
      query,
      searchBy,
    }))
    if (mode === 'merge') {
      setData([...data, ...res?.data ?? []])
    }
    if (mode === 'clean') {
      setData(res?.data ?? [])
    }
    setMetadata(res?.queryUsed)
    setNeedFetching(false)
    return res
  }

  const fetch = useCallback(fetchF, [storage, data])

  // ========================================
  // ============= UPDATE HOOKS =============
  // ========================================

  const configAutoFetching = () => {
    if (!autoFetch) return
    if (!needFetching) return
    fetch({})
  }

  const configAppMode = () => {
    if (isAppNetStatus(AppNetStatus.mountOffline)) {
      debounce(() => storage.goOffline({
        limit: 'NONE'
      }))
      setAppNetStatus(AppNetStatus.offline)
    }
    if (isAppNetStatus(AppNetStatus.unmountOffline)) {
      storage.goOnline()
      setAppNetStatus(AppNetStatus.online)
    }
  }

  useEffect(configAutoFetching, [autoFetch, offline, fetch, needFetching])
  useEffect(configAppMode, [offline, storage, isAppNetStatus, setAppNetStatus, debounce])

  // ============================================
  // ============= CREATE FUNCTIONS =============
  // ============================================

  const create = async (dto: CreateParams<Model>) => {
    const res = await storage.create({
      data: dto,
    })
    if (res && Array.isArray(res)) {
      setData([...data, ...res])
    }
    if (res && !Array.isArray(res)) {
      setData([...data, res])
    }
    return !!res
  }

  // ============================================
  // ============= UPDATE FUNCTIONS =============
  // ============================================

  const update = async (params: UpdateParams<Model>) => {
    const { id, data: newData } = params
    const old = await findOne({id})
    const res = await storage.update(params)
    if (!res) return false
    const index = data.findIndex((e) => e.id === id)
    if (index === -1) return false
    data[index] = {
      ...old,
      ...newData as Model
    }
    return true
  }

  // ============================================
  // ============= DELETE FUNCTIONS =============
  // ============================================

  const remove = async (params: DeleteParams<Model>) => {
    const res = await storage.delete(params)
    if (!res) return false
    const index = data.findIndex((e) => e.id === params.id)
    if (index === -1) return false
    delete data[index]
    return true
  }

  return {
    data,
    setData,
    metadata,
    validate,
    findOne,
    findBy,
    fetch,
    create,
    update,
    delete: remove
  }
}
