import { ValidatorOptions } from 'class-validator'
import { ClassConstructor, ClassTransformOptions } from 'class-transformer'
import { IQuery } from '../validations/query'
import { IBaseModel } from '../models_school/base.model'

export enum EXPOSE_VERSIONS {
  UPDATE = 1,
  CREATE = 2,
  FULL = 3,
  GET = 4,
  GET_OPERATOR=5,
  CREATE_NESTED = 6,
  DELETE = 7
}

export interface CreateParams<Model extends IBaseModel> {
  data: Model | Model[]
}

export interface ReadParams<Model extends IBaseModel> {
  searchBy: Omit<Partial<Model>, 'id'> | Pick<Model, 'id'>
  query: IQuery
}

export interface UpdateParams<Model extends IBaseModel> {
  id: Model['id']
  data: Omit<Partial<Model>, 'id'>
}

export interface DeleteParams<Model extends IBaseModel> {
  id: Model['id']
  softDelete?: boolean
}

export type QueryUsed = Partial<IQuery> & { count: number }

/* export interface IController<Model extends IBaseModel> {
  create: (params: CreateParams) => Promise<boolean | Model[]>
  read: (params: ReadParams) => Promise<{ data: null | Model[], queryUsed: QueryUsed}>
  update: (params: UpdateParams) => Promise<boolean>
  delete: (params: DeleteParams) => Promise<boolean>
}
*/

export type ModelClassType<Model> = ClassConstructor<Model>

export interface ValidateDtoOptions<Model> {
  dto: object
  model: ModelClassType<Model>
  version?: EXPOSE_VERSIONS
  validatorOptions?: ValidatorOptions
  transformOptions?: ClassTransformOptions
}

export interface ValidateIdOptions<Model extends IBaseModel> {
  searchBy?: ReadParams<Model>['searchBy']
  model: ModelClassType<Model>
  version: EXPOSE_VERSIONS
}
