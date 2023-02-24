import { useCallback, useEffect, useMemo, useState } from 'react'
import { StorageRequest, ReadParams, DeleteParams,UpdateParams } from '../../api/services'
import { IBaseModel } from '../../api/models_school/base.model'
import { ModelClassType, QueryUsed } from '../../api/types'
import { filterBy } from '../../api/services/utils'
import { useDebounce } from '../useDebouce'
import { useNetStatus, AppNetStatus } from '../useNetStatus'
import { SearchBy, SearchById } from '../../api/services/types'

export interface BaseParams<Model extends IBaseModel> {
  path: string
  model: ModelClassType<Model>
  initFetch?: boolean
}

type FetchParams<Model extends IBaseModel> = {
  mode?: 'clean' | 'merge',
} & ReadParams<Model>

interface FetchNextParams {
  offset: number,
  limit: number
}

type CreateParams<Model extends IBaseModel> = Model | Model[]

const secureMerge = <T extends IBaseModel>(listOne: Array<T>, listTwo: Array<T>) => {
  const list = [...listOne, ...listTwo]
  return list.filter((item, index) => {
    return list.findIndex((s) => s.id === item.id) === index
  })
}

export const useBase = <Model extends IBaseModel>(params: BaseParams<Model>) => {
  // ========== DATA HOOKS ==========
  const [metadata, setMetadata] = useState<(QueryUsed & {
    searchByUsed?: SearchBy<Model> | SearchById<Model>
  }) | undefined>(undefined)
  const [data, setData] = useState<Model[]>([])

  // ========== HELPER HOOKS ==========
  const { setAppNetStatus, isAppOffline, isAppNetStatus } = useNetStatus()
  const { debounce } = useDebounce()
  const [needFetchNext, setNeedFetchNext] = useState(false)
  const [fetchNextParams, setFetchNextParams] = useState<FetchNextParams>({
    offset: 0,
    limit: 10
  })

  // ========== CONFIG ==========
  const { path, initFetch = true, model } = params
  const [isInit, setIsInit] = useState(true)
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
    setMetadata({
      ...remote.queryUsed,
      searchByUsed: searchBy
    })
    return remote.data
  }

  const fetchF = async (params: FetchParams<Model>) => {
    const { query, searchBy, mode = 'clean' } = params
    const res = await (storage.read({
      query,
      searchBy,
    }))
    if (mode === 'merge') {
      const merged = secureMerge(data, res.data ?? [])
      setData(merged)
    }
    if (mode === 'clean') {
      setData(res?.data ?? [])
    }
    setMetadata(res?.queryUsed)
    setMetadata({
      ...res?.queryUsed,
      searchByUsed: searchBy
    })
    return res
  }

  const fetch = useCallback(fetchF, [storage, data])

  const fetchNext = useCallback(async () => {
    try {
      if (!metadata) return
      const { limit, offset } = fetchNextParams
      if (offset > metadata.count) return
      const { searchByUsed, ...rest } = metadata
      return await fetch({ mode: 'merge', query: {
        ...rest,
        offset: String(offset),
        limit: String(limit)
      }, searchBy: searchByUsed})
    } catch (err) {
      throw err
    }

  }, [fetch, metadata, fetchNextParams])

  const launchNextFetch = (params?: Partial<{
    limit?: FetchNextParams['limit'],
    offset?: FetchNextParams['offset'] | 'auto' | 'previous'
  }>) => {
    const { offset: previousOffset, limit: previousLimit } = fetchNextParams
    const { offset: newOffset, limit: newLimit } = params ?? {
      limit: undefined,
      offset: undefined
    }
    const makeParams = () => {
      const limit = newLimit ?? previousLimit
      if (typeof newOffset === 'undefined' || newOffset === 'auto') {
        return {
          limit,
          offset: (previousOffset + limit)
        }
      }
      if (newOffset === 'previous') {
        return {
          limit,
          offset: previousOffset
        }
      }
      return {limit, offset: newOffset}
    }
    setFetchNextParams(makeParams())
    setNeedFetchNext(true)
  }

  // ========================================
  // ============= UPDATE HOOKS =============
  // ========================================

  const configInitFetching = () => {
    if (!isInit || !initFetch) return
    fetch({})
    return setIsInit(false)
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

  const configFetchNext = () => {
    if (!needFetchNext) return
    fetchNext().then(() => {
      setNeedFetchNext(false)
    })
  }

  useEffect(configInitFetching, [initFetch, offline, fetch, isInit])
  useEffect(configAppMode, [offline, storage, isAppNetStatus, setAppNetStatus, debounce])
  useEffect(configFetchNext, [needFetchNext, fetchNext, fetchNextParams])

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
    launchNextFetch,
    fetchNextParams,
    needFetchNext,
    create,
    update,
    delete: remove
  }
}
