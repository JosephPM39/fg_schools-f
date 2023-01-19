import { useCallback, useEffect, useMemo, useState } from 'react'
import { StorageRequest, CreateParams, ReadParams } from '../../api/services'
import { IBaseModel } from '../../api/models_school/base.model'
import { ModelClassType, QueryUsed } from '../../api/types'
import { filterBy } from '../../api/services/utils'
import { useDebounce } from '../useDebouce'

export interface BaseParams<Model extends IBaseModel> {
  path: string
  model: ModelClassType<Model>
  autoFetch?: boolean
  netStatus: {
    offlineMode: boolean
    netOnline: boolean
  }
}

export const useBase = <Model extends IBaseModel>(params: BaseParams<Model>) => {
  const [data, setData] = useState<Model[] | undefined>([])
  const [metadata, setMetadata] = useState<QueryUsed | undefined>(undefined)
  const [needFetching, setNeedFetching] = useState(false)
  const { offlineMode: offline, netOnline } = params.netStatus

  const storage = useMemo(() => new StorageRequest<Model>(), [])

  const findOneLocal = ({id}: {id?: Model['id']}) => {
    const local = data?.find((e) => e.id === id) ?? undefined
    if (local) return local
  }

  const findOne = async ({id}:{id?: Model['id']}): Promise<Model | undefined> => {
    if (!id || !data || data.length < 1) return undefined
    const local = findOneLocal({id})
    if (local) return local

    const remote = await (storage.read({
      searchBy: { id },
      ...params,
      offline
    }))

    if (!remote?.data || remote?.data?.length < 1) return undefined

    if (!findOneLocal({id})){
      data.push(...remote.data)
    }

    return remote.data[0]
  }

  const findBy = async (searchBy: Partial<Model> | undefined): Promise<Model[] | undefined> => {
    if (!searchBy || !data || data.length < 1) return undefined

    const local = filterBy<Model>(data ?? [], searchBy)
    if (local.length > 0) return local

    const remote = await (storage.read({
      searchBy,
      ...params,
      offline
    }))
    if (!remote?.data) return undefined
    data.push(...remote.data)
    setMetadata(remote.queryUsed)
    return remote.data
  }

  const create = async ({data: dto }: Pick<CreateParams<Model>, 'data'>) => {
    const res = await storage.create({
      data: dto,
      ...params,
      offline
    })
    if (res && Array.isArray(res)) {
      data?.push(...res)
    }
    if (res && !Array.isArray(res)) {
      data?.push(res)
    }
    return !!res
  }

  const fetch = useCallback(async ({
    query,
    searchBy,
    mode = 'clean'
  }: Partial<Pick<ReadParams<Model>, 'query' | 'searchBy'>> & {mode?: 'clean' | 'merge'
    }) => {
    const res = await (storage.read({
      query,
      searchBy,
      ...params,
      offline
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
  }, [params, storage, offline, data])

  useEffect(() => {
    if (data && data.length < 1 && params.autoFetch !== false) {
      setNeedFetching(true)
    }
  }, [data, params.autoFetch, offline])

  useEffect(() => {
    if (!needFetching) return
    fetch({})
  }, [needFetching, fetch])

  const {debounce} = useDebounce()

  useEffect(() => {
    if (offline && netOnline) {
      debounce(() => storage.goOffline({
        path: params.path,
        limit: 'NONE'
      }))
    }
    if (!offline) {
      storage.goOnline()
    }
  }, [offline, storage, params.path, netOnline])

  return {
    data,
    metadata,
    create,
    fetch,
    findBy,
    findOne
  }
}
