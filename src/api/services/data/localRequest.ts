import { ResponseError, Responses } from '../../handlers/errors'
import { IBaseModel } from '../../models_school/base.model'
import { QueryUsed } from '../../types'
import { PostParams, DeleteParams, PatchParams, ReadParams } from '../types'
import { debounce, filterBy, queryFilter } from '../utils'

interface Crud<Model extends IBaseModel> {
  read: (p: ReadParams<Model>) => Promise<{
    data: Model[] | null,
    queryUsed: QueryUsed
  }>
  create: (p: PostParams<Model>) => Promise<Model[] | false>
  patch: (p: PatchParams<Model>) => Promise<boolean>
  delete: (p: DeleteParams<Model>) => Promise<boolean>
}

export class LocalRequest<Model extends IBaseModel> implements Crud<Model> {

  constructor(
    private path: string
  ) {}

  read = ({searchBy,query}: ReadParams<Model>) => debounce(() => {
    const existent = this.get(this.path)
    if (!searchBy) {
      return queryFilter(existent ?? [], query)
    }
    const filteredBy = filterBy<Model>(existent ?? [], searchBy as Partial<Model>)
    return queryFilter(filteredBy, query)
  }, [])

  create = ({ data }: PostParams<Model>) => debounce(() => {
    const existent = this.get(this.path)

    if (existent && Array.isArray(data)) {

      const duplicates = data.filter(
        (d) => filterBy<Model>(
          existent, {id: d.id} as Partial<Model>
        ).length > 0
      )

      if (duplicates.length > 0) {
        throw new ResponseError(Responses[400], 'El dato ya existe')
      }
      const d = [...existent, ...data]
      return this.set(this.path, d) ? data : false
    }

    if (existent && !Array.isArray(data)) {
      const duplicates = filterBy(existent, {id: data.id} as Partial<Model>)
      if (duplicates.length > 0) {
        throw new ResponseError(Responses[400], 'El dato ya existe')
      }
      const d = [...existent, data]
      return this.set(this.path, d) ? [data] : false
    }

    if (Array.isArray(data)) {
      return this.set(this.path, data) ? data : false
    }

    return this.set(this.path, [data]) ? [data] : false
  }, [])

  patch = ({ data, id }: PatchParams<Model>) => debounce(() => {
    const existent = this.get(this.path)
    if (!existent) throw new ResponseError(Responses[404], 'No existe la colección')

    const index = existent.findIndex((e) => e.id === id)
    if (index === -1) throw new ResponseError(Responses[404])

    existent[index] = {
      ...existent[index],
      ...data
    }

    return this.set(this.path, existent)
  }, [])

  delete = ({ id }: DeleteParams<Model>) => debounce(() => {
    const existent = this.get(this.path)
    if (!existent) throw new ResponseError(Responses[404], 'No existe la colección')

    const index = existent.findIndex((e) => e.id === id)
    if (index === -1) throw new ResponseError(Responses[404])

    const res = delete existent[index]
    if (!res) return false

    return this.set(this.path, existent)
  }, [])

  get = (k: string) => {
    try {
      const data = window.localStorage.getItem(k)
      if (!data) return undefined
      return JSON.parse(data) as Model[]
    } catch (e) {
      console.error(e)
      return undefined
    }
  }

  set = (k: string, data: Model[]) => {
    try {
      window.localStorage.setItem(k, JSON.stringify(data))
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  remove = (k: string) => {
    try {
      window.localStorage.removeItem(k)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  destroy = () => {
    try {
      window.localStorage.clear()
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
