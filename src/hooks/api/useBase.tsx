import { useCallback, useEffect, useMemo, useState } from 'react'
import { StorageRequest, ReadParams, DeleteParams, UpdateParams } from '../../api/services'
import { IBaseModel } from '../../api/models_school/base.model'
import { ModelClassType, QueryUsed } from '../../api/types'
import { filterBy } from '../../api/services/utils'
import { useDebounce } from '../useDebouce'
import { useNetStatus, AppNetStatus } from '../useNetStatus'
import { SearchBy, SearchById } from '../../api/services/types'
import { ErrorCatched } from '../../api/handlers/errors'

export interface BaseParams<Model extends IBaseModel> {
  path: string
  model: ModelClassType<Model>
  initFetch?: boolean
}

type FetchParams<Model extends IBaseModel> = {
  mode?: 'clean' | 'merge' | 'info'
} & ReadParams<Model>

interface FetchNextParams {
  offset: number
  limit: number
}

type CreateParams<Model extends IBaseModel> = Model | Model[]

const secureMerge = <T extends IBaseModel>(listOne: T[], listTwo: T[]) => {
  const list = [...listOne, ...listTwo]
  const filtred = list.filter((item, index) => {
    return list.findIndex((s) => s.id === item.id) === index
  })
  console.log('MERGING:',
    'F:', listOne.length,
    'FM:', listOne.at(listOne.length - 1)?.id?.slice(0, 3),
    'S:', listTwo.length,
    'SM:', listTwo.at(0)?.id?.slice(0, 3),
    'MERGED:', list.length,
    'FILTERED:', filtred.length
  )
  return filtred
}

type FetchNextStatus<T extends IBaseModel> = FetchNextParams & ({
  status: 'fetching' | 'done'
} | {
  status: 'error'
  error?: ErrorCatched
} | {
  status: 'merging'
  data: T[] | null
}) & {
  id: number
}

type ReturnFFNStatus<T extends 'index' | 'value', M extends IBaseModel> = T extends 'index' ? number : FetchNextStatus<M>

const findFNStatus = <
  M extends IBaseModel,
  T extends 'index' | 'value' = 'value'
>(
    p: Partial<FetchNextStatus<M>>,
    l: Array<FetchNextStatus<M>>,
    t: T, by: 'props' | 'id' = 'props'
  ): ReturnFFNStatus<T, M> => {
  const conditionByProps = (i: FetchNextStatus<M>) => i.offset === p.offset && i.limit === p.limit
  const conditionById = (i: FetchNextStatus<M>) => i.id === p.id
  const condition = by === 'props' ? conditionByProps : conditionById
  if (t === 'index') return l.findIndex(condition) as ReturnFFNStatus<T, M>
  return l.find(condition) as ReturnFFNStatus<T, M>
}

export const useBase = <Model extends IBaseModel>(params: BaseParams<Model>) => {
  // ========== DATA HOOKS ==========
  const [metadata, setMetadata] = useState<(QueryUsed<Model> & {
    searchByUsed?: SearchBy<Model> | SearchById<Model>
  }) | undefined>(undefined)
  const [data, setData] = useState<Model[]>([])

  // ========== HELPER HOOKS ==========
  const { setAppNetStatus, isAppOffline, isAppNetStatus } = useNetStatus()
  const { debounce } = useDebounce()
  const [isFetching, setIsFetching] = useState(false)
  const [fetchNextStatus, setFetchNextStatus] = useState<Array<FetchNextStatus<Model>>>([])

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

  const findOne = async ({ id }: { id?: Model['id'] }) => {
    if (!id) return null

    const local = findOneLocal(id)
    if (local != null) return local

    const remote = await storage.read({
      searchBy: { id }
    })
    if (((remote?.data) == null) || remote?.data?.length < 1) return null

    if (findOneLocal(id) == null) {
      data.push(...remote.data)
    }
    return remote.data[0]
  }

  const findBy = async (searchBy?: SearchBy<Model>) => {
    if (searchBy == null) return null

    const local = filterBy<Model>(data, searchBy as Partial<Model>)
    if (local.length > 0) return local

    const remote = await (storage.read({
      searchBy
    }))
    if ((remote?.data) == null) return null
    if (filterBy<Model>(data, searchBy as Partial<Model>).length < 1) {
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
    setIsFetching(true)
    try {
      const res = await (storage.read({
        query,
        searchBy
      }))
      if (mode === 'merge') {
        const merged = secureMerge(data, res.data ?? [])
        setData(merged)
      }
      if (mode === 'clean') {
        setData(res?.data ?? [])
        setFetchNextStatus([{
          limit: parseInt(res.queryUsed?.limit ?? '0'),
          offset: parseInt(res.queryUsed?.offset ?? '0'),
          status: 'done',
          id: 0
        }])
      }
      if (mode === 'info') {
        setIsFetching(false)
        return res
      }
      setMetadata({
        ...res?.queryUsed,
        searchByUsed: searchBy
      })
      setIsFetching(false)
      return res
    } catch (err) {
      setIsFetching(false)
      throw err
    }
  }

  const fetch = useCallback(fetchF, [storage, data])

  const fetchNext = useCallback(async (params: FetchNextParams) => {
    if (metadata == null) return
    const { limit, offset } = params
    if (offset > metadata.count) return
    const { searchByUsed, ...rest } = metadata

    const fnsIndex = findFNStatus(params, fetchNextStatus, 'index')
    if (fnsIndex > 0) return fetchNextStatus[fnsIndex]

    const length = fetchNextStatus.length
    const id = length > 0 ? fetchNextStatus[length - 1].id : 0
    const fns: FetchNextStatus<Model> = {
      ...params,
      id,
      status: 'fetching'
    }
    setFetchNextStatus([...fetchNextStatus, fns])

    try {
      const res = await fetch({
        mode: 'info',
        query: {
          ...rest,
          offset: String(offset),
          limit: String(limit)
        },
        searchBy: searchByUsed
      })

      const fnsIndex = findFNStatus(params, fetchNextStatus, 'index')
      const old = fnsIndex > 0 ? fetchNextStatus[fnsIndex] : params
      const length = fetchNextStatus.length
      const id = length > 0 ? fetchNextStatus[length - 1].id : 0
      const fns: FetchNextStatus<Model> = {
        ...old,
        id,
        status: 'merging',
        data: res.data
      }
      setFetchNextStatus([...fetchNextStatus, fns])
      setMetadata({
        ...res.queryUsed,
        searchByUsed
      })
      return fns
    } catch (err) {
      const fnsIndex = findFNStatus(params, fetchNextStatus, 'index')
      const old = fnsIndex > 0 ? fetchNextStatus[fnsIndex] : params
      const length = fetchNextStatus.length
      const id = length > 0 ? fetchNextStatus[length - 1].id : 0
      const fns: FetchNextStatus<Model> = {
        ...old,
        id,
        status: 'error',
        error: err as any
      }
      setFetchNextStatus([...fetchNextStatus, fns])
      return fns
    }
  }, [fetch, metadata, fetchNextStatus])

  const launchNextFetch = useCallback((params?: Partial<{
    limit?: FetchNextParams['limit']
    offset?: FetchNextParams['offset'] | 'auto' | 'previous'
  }>) => {
    const fnsPreIndex = fetchNextStatus.length - 1
    const defaultFNS = { limit: 10, offset: -10 }
    const previous = fnsPreIndex < 0 ? defaultFNS : fetchNextStatus[fnsPreIndex]
    const { offset: previousOffset, limit: previousLimit } = previous
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
      return { limit, offset: newOffset }
    }

    void fetchNext(makeParams())
  }, [fetchNext, fetchNextStatus])

  const clearRequests = () => {
    setData([])
    setMetadata(undefined)
  }

  // ========================================
  // ============= UPDATE HOOKS =============
  // ========================================

  const configInitFetching = () => {
    if (!isInit || !initFetch) return
    void fetch({})
    return setIsInit(false)
  }

  const configAppMode = () => {
    if (isAppNetStatus(AppNetStatus.mountOffline)) {
      debounce(async () => await storage.goOffline({
        limit: 'NONE'
      }))
      setAppNetStatus(AppNetStatus.offline)
    }
    if (isAppNetStatus(AppNetStatus.unmountOffline)) {
      void storage.goOnline()
      setAppNetStatus(AppNetStatus.online)
    }
  }

  const configFNSMerger = () => {
    const toMerge = fetchNextStatus.filter((s) => s.status === 'merging')
    if (toMerge.length < 1) return

    const finalData: Model[] = []
    const toUpdate: Array<FetchNextStatus<Model>> = toMerge.map((item) => {
      if (item.status !== 'merging') return item
      const { data, ...rest } = item
      finalData.push(...data ?? [])
      return {
        ...rest,
        status: 'done'
      }
    })

    const finalStatus = fetchNextStatus.map(({ id }) => {
      return findFNStatus({ id }, toUpdate, 'value', 'id')
    })
    const merge = secureMerge(data, finalData)
    setFetchNextStatus(finalStatus)
    setData(merge)
  }

  useEffect(configInitFetching, [initFetch, offline, fetch, isInit])
  useEffect(configAppMode, [offline, storage, isAppNetStatus, setAppNetStatus, debounce])
  useEffect(configFNSMerger, [fetchNextStatus, data])

  // ============================================
  // ============= CREATE FUNCTIONS =============
  // ============================================

  const create = async (dto: CreateParams<Model>) => {
    const res = await storage.create({
      data: dto
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
    const old = await findOne({ id })
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
    const index = data.findIndex((e) => e.id === params.id)
    console.log(data.splice(index, (index + 1)))
    if (metadata?.count) {
      metadata.count = metadata.count - 1
    }
    return res
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
    needFetchNext: isFetching,
    clearRequests,
    isFetching,
    create,
    update,
    delete: remove
  }
}
