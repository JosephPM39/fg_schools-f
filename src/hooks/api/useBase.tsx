import { useCallback, useEffect, useState } from 'react'
import { create as apiCreate, read, CreateParams, ReadParams } from '../../api/services'
import { IBaseModel } from '../../api/models_school/base.model'
import { ModelClassType, QueryUsed } from '../../api/types'
import { filterBy } from '../../api/services/utils'

export interface BaseParams<Model extends IBaseModel> {
  path: string
  model: ModelClassType<Model>
  autoFetch?: boolean
}

export const useBase = <Model extends IBaseModel>(params: BaseParams<Model>) => {
  const [data, setData] = useState<Model[] | undefined>([])
  const [metadata, setMetadata] = useState<QueryUsed | undefined>(undefined)
  const [needFetching, setNeedFetching] = useState(false)
  const offline = false

  const findOneLocal = ({id}: {id?: Model['id']}) => {
    const local = data?.find((e) => e.id === id) ?? null
    if (local) return local
  }

  const findOne = async ({id}:{id?: Model['id']}): Promise<Model | undefined> => {
    if (!id || !data || data.length < 1) return undefined
    const local = findOneLocal({id})
    if (local) return local

    const remote = await (read<Model>({
      searchBy: id,
      ...params,
      offline
    }))
    if (!remote?.data) return undefined

    if (!findOneLocal({id})){
      data.push(...remote.data)
    }

    return remote.data?.[0]
  }

  const findBy = async (searchBy: Partial<Model> | undefined): Promise<Model[] | undefined> => {
    if (!searchBy || !data || data.length < 1) return undefined

    const local = filterBy<Model>(data ?? [], searchBy)
    if (local.length > 0) return local

    const remote = await (read<Model>({
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
    const res = await apiCreate<Model>({
      data: dto,
      ...params,
      offline
    })
    if (res) {
      data?.push(res)
    }
    return !!res
  }

  /* const fetch = useCallback(({query, searchBy }: Pick<ReadParams<Model>, 'query' | 'searchBy'>) => new Promise<boolean>((resolve, reject) => {
    debounce(() => {
      read<Model>({
        query,
        searchBy,
        ...params,
        offline
      }).then((res) => {
        setData(res?.data)
        setNeedFetching(false)
        resolve(!!res)
      }).catch((_) => {
        reject(false)
      })
    })
  })
  , [params, offline, debounce])
*/

  const fetch = useCallback(async ({
    query,
    searchBy,
    mode = 'clean'
  }: Pick<ReadParams<Model>, 'query' | 'searchBy'> & {mode?: 'clean' | 'merge'
    }) => {
    const res = await (read<Model>({
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

    return !!res
  }, [params, offline, data])

  useEffect(() => {
    if (data && data.length < 1 && params.autoFetch !== false) {
      setNeedFetching(true)
    }
  }, [data, params.autoFetch])

  useEffect(() => {
    if (!needFetching) return
    fetch({})
  }, [needFetching, fetch])

  return {
    data,
    metadata,
    create,
    fetch,
    findBy,
    findOne
  }
}
