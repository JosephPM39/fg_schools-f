import { IBaseModel } from "../models_school/base.model"
import { IQuery } from "../validations/query"

export interface BaseApiParams {
  path: string,
}

export interface PostParams<Model> extends BaseApiParams {
  data: Model[] | Model
}

export interface GetParams<Model extends IBaseModel> extends BaseApiParams {
  query?: IQuery
  searchBy?: Pick<Model, 'id'>
}

export interface GetFilteredParams<Model extends IBaseModel> extends BaseApiParams {
  query?: IQuery
  searchBy?: Omit<Partial<Model>, 'id'>
}

export interface PatchParams<Model extends IBaseModel> extends BaseApiParams {
  data: Omit<Partial<Model>, 'id'>
  id: Model['id']
}

export interface DeleteParams<Model extends IBaseModel> extends BaseApiParams {
  id: Model['id']
}
