import { IBaseModel } from "../models_school/base.model"
import { IQuery } from "../validations/query"

export type SearchById<Model extends IBaseModel> = {id: Model['id']}
export type SearchBy<Model extends IBaseModel> = Partial<Omit<Model, 'id'>>

export interface PostParams<Model> {
  data: Model[] | Model
}

export type ReadParams<Model extends IBaseModel> = {
  query?: IQuery
  searchBy?: SearchById<Model> | SearchBy<Model>
}

export interface GetNormalParams<Model extends IBaseModel> extends ReadParams<Model> {
  searchBy?: SearchById<Model>
}

export interface GetFilteredParams<Model extends IBaseModel> extends ReadParams<Model> {
  query?: IQuery
  searchBy?: SearchBy<Model>
}

export interface PatchParams<Model extends IBaseModel> {
  data: Partial<Omit<Model, 'id'>>
  id: Model['id']
}

export interface DeleteParams<Model extends IBaseModel> {
  id: Model['id']
}

export const isSearchById = <Model extends IBaseModel>(search: SearchById<Model> | SearchBy<Model>): search is SearchById<Model> => {
  return (search as SearchById<Model>).id !== undefined
}


