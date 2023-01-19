import { useCallback, useEffect, useMemo, useState } from 'react'
import { StorageRequest, ReadParams } from '../../api/services'
import { IBaseModel } from '../../api/models_school/base.model'
import { ModelClassType, QueryUsed } from '../../api/types'
import { filterBy } from '../../api/services/utils'
import { useDebounce } from '../useDebouce'
import { useNetStatus, AppNetStatus } from '../useNetStatus'

export interface BaseParams<Model extends IBaseModel> {
  path: string
  model: ModelClassType<Model>
  autoFetch?: boolean
}

type FetchParams<Model extends IBaseModel> = Partial<Pick<ReadParams<Model>, 'query' | 'searchBy'>> & {
  mode?: 'clean' | 'merge'
}

export const useBase = <Model extends IBaseModel>(params: BaseParams<Model>) => {
  // ========== DATA HOOKS ==========
  const [metadata, setMetadata] = useState<QueryUsed | undefined>(undefined)
  const [data, setData] = useState<Model[] | undefined>([])
  const [needFetching, setNeedFetching] = useState(false)

  // ========== HELPER HOOKS ==========
  const { appNetStatus, setAppNetStatus, isAppOffline } = useNetStatus()
  const storage = useMemo(() => new StorageRequest<Model>(), [])
  const { debounce } = useDebounce()
  const offline = isAppOffline()

  // ========== CONFIG ==========
  const requestConfig = useMemo(() => ({
    ...params,
    offline
  }), [params, offline])

  // ==========================================
  // ============= READ FUNCTIONS =============
  // ==========================================

  const findOneLocal = (id?: Model['id']) => {
    return data?.find((e) => e.id === id)
  }

  const findOne = async ({id}: {id?: Model['id']}) => {
    if (!id || !data || data.length < 1) return undefined

    const local = findOneLocal(id)
    if (local) return local

    const remote = await storage.read({
      searchBy: { id },
      ...requestConfig
    })
    if (!remote?.data || remote?.data?.length < 1) return undefined

    if (!findOneLocal(id)){
      data.push(...remote.data)
    }
    return remote.data[0]
  }

  const findBy = async (searchBy?: Partial<Model>) => {
    if (!searchBy || !data || data.length < 1) return undefined

    const local = filterBy<Model>(data ?? [], searchBy)
    if (local.length > 0) return local

    const remote = await (storage.read({
      searchBy,
      ...requestConfig
    }))
    if (!remote?.data) return undefined

    data.push(...remote.data)
    setMetadata(remote.queryUsed)
    return remote.data
  }

  const fetchF = async ({ query, searchBy, mode = 'clean' }: FetchParams<Model>) => {
    const res = await (storage.read({
      query,
      searchBy,
      ...requestConfig
    }))
    if (mode === 'merge') {
      setData([...data ?? [], ...res?.data ?? []])
    }
    if (mode === 'clean') {
      setData(res?.data)
    }
    setMetadata(res?.queryUsed)
    setNeedFetching(false)
    return res
  }

  const fetch = useCallback(fetchF, [storage, requestConfig, data])

  // ========================================
  // ============= UPDATE HOOKS =============
  // ========================================

  const configFetching = () => {
    if (!(data && data.length < 1 && params.autoFetch !== false)) return
    setNeedFetching(true)
  }

  const configAutoFetch = () => {
    if (!needFetching) return
    fetch({})
  }

  const configAppMode = () => {
    if (appNetStatus === AppNetStatus.mountOffline) {
      debounce(() => storage.goOffline({
        path: requestConfig.path,
        limit: 'NONE'
      }))
      setAppNetStatus(AppNetStatus.offline)
    }
    if (appNetStatus === AppNetStatus.unmountOffline) {
      storage.goOnline()
      setAppNetStatus(AppNetStatus.online)
    }
  }

  useEffect(configFetching, [data, params.autoFetch, offline])
  useEffect(configAutoFetch, [needFetching, fetch])
  useEffect(configAppMode, [offline, appNetStatus, requestConfig.path])

  // ============================================
  // ============= CREATE FUNCTIONS =============
  // ============================================

  const create = async (dto: Model | Model[]) => {
    const res = await storage.create({
      data: dto,
      ...requestConfig
    })
    if (res && Array.isArray(res)) {
      data?.push(...res)
    }
    if (res && !Array.isArray(res)) {
      data?.push(res)
    }
    return !!res
  }

  return {
    data,
    metadata,
    create,
    fetch,
    findBy,
    findOne
  }
}
