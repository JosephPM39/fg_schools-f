import { IQuery } from "../validations/query"

export type Data<Model> = Model | Model[]

export interface BaseApiParams {
  path: string,
  token?: string
}

export interface PostParams<Model> extends BaseApiParams {
  data: Data<Model>
}

export interface GetParams extends BaseApiParams {
  query?: IQuery
  searchBy?: string | object
}

export interface PatchParams<Model> extends BaseApiParams {
  data: Data<Model>,
  id: string
}

export interface DeleteParams extends BaseApiParams {
  id: string
}
