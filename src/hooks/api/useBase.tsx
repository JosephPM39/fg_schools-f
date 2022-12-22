import { useEffect, useState } from 'react'
import { create as apiCreate, read, CreateParams, ReadParams } from '../../api/services'
import { IBaseModel } from '../../api/models_school/base.model'
import { ModelClassType } from '../../api/types'

interface BaseParams<Model extends IBaseModel> {
  path: string
  offline: boolean
  model: ModelClassType<Model>
  autoFetch?: boolean
}

export const useBase = <Model extends IBaseModel>(params: BaseParams<Model>) => {
  const [data, setData] = useState<Model[] | undefined>([])

  useEffect(() => {
    if (data && data.length < 1 && params.autoFetch !== false) {
      fetch({})
    }
  })

  const findOne = async ({ id }:{ id: string | Model | undefined}): Promise<Model | undefined> => {
    if (!id) return undefined
    if (typeof id !== 'string') return id
    if (!data) return undefined
    if (data.length < 1) return undefined
    const local = data.find((e) => e.id === id) ?? null
    if (!local) {
      const remote = await read<Model>({
        searchBy: id,
        ...params
      })
      if (!remote) return undefined
      data.push(...remote)
      return remote[0]
    }
  }

  const create = async ({data: dto }: Pick<CreateParams<Model>, 'data'>) => {
    const res = await apiCreate<Model>({
      data: dto,
      ...params
    })
    if (res) {
      data?.push(res)
    }
    return !!res
  }

  const fetch = async ({query, searchBy }: Pick<ReadParams<Model>, 'query' | 'searchBy'>) => {
    const res = await read<Model>({
      query,
      searchBy,
      ...params
    })
    setData(res)
    return !!res
  }

  return {
    data,
    create,
    fetch,
    findOne
  }
}
