import { IBaseModel } from '../models_school/base.model'
import { PostParams, DeleteParams, PatchParams, ReadParams } from './types'
import { filterBy, queryFilter } from './utils'

export class LocalRequest<Model extends IBaseModel> {

  constructor(
    private path: string
  ) {}

  read = ({ searchBy, query }: ReadParams<Model>) => {
    const existent = this.get(this.path)
    if (!existent) return undefined
    if (!searchBy) {
      return queryFilter(existent, query)
    }
    const filteredBy = filterBy<Model>(existent, searchBy as Partial<Model>)
    return queryFilter(filteredBy, query)
  }

  create = ({ data }: PostParams<Model>) => {
    const existent = this.get(this.path)

    if (existent && Array.isArray(data)) {

      const duplicates = data.filter(
        (d) => filterBy<Model>(
          existent, {id: d.id} as Partial<Model>
        ).length > 0
      )

      if (duplicates.length > 0) {
        throw new Error('Duplicate data not allowed')
      }
      const d = [...existent, ...data]
      return this.set(this.path, d) ? data : undefined
    }

    if (existent && !Array.isArray(data)) {
      const duplicates = filterBy(existent, {id: data.id} as Partial<Model>)
      if (duplicates.length > 0) {
        throw new Error('Duplicate data not allowed')
      }
      const d = [...existent, data]
      return this.set(this.path, d) ? [data] : undefined
    }

    if (Array.isArray(data)) {
      return this.set(this.path, data) ? data : undefined
    }

    return this.set(this.path, [data]) ? [data] : undefined
  }

  patch = ({ data, id }: PatchParams<Model>) => {
    const existent = this.get(this.path)
    if (!existent) return false

    const index = existent.findIndex((e) => e.id === id)
    if (index === -1) return false

    existent[index] = {
      ...existent[index],
      ...data
    }

    return this.set(this.path, existent)
  }

  delete = ({ id }: DeleteParams<Model>) => {
    const existent = this.get(this.path)
    if (!existent) return false

    const index = existent.findIndex((e) => e.id === id)
    if (index === -1) return false

    const res = delete existent[index]
    if (!res) return false

    return this.set(this.path, existent)
  }

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
