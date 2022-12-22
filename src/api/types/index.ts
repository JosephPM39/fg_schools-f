import { ValidatorOptions } from 'class-validator'
import { ClassConstructor } from 'class-transformer'
import { IQuery } from '../validations/query'

export enum EXPOSE_VERSIONS {
  UPDATE = 1,
  CREATE = 2,
  FULL = 3,
  GET = 4,
  CREATE_NESTED = 5,
  DELETE = 6
}

type IdBy = string | object

export interface CreateParams {
  data: object[] | object
}

export interface ReadParams {
  idBy: IdBy
  query: IQuery
}

export interface UpdateParams {
  idBy: IdBy
  data: object
}

export interface DeleteParams {
  idBy: IdBy
  softDelete?: boolean
}

export interface IController<Model> {
  create: (params: CreateParams) => Promise<boolean | Model[]>
  read: (params: ReadParams) => Promise<null | Model[]>
  update: (params: UpdateParams) => Promise<boolean>
  delete: (params: DeleteParams) => Promise<boolean>
}

export type ModelClassType<Model> = ClassConstructor<Model>

export interface ValidateDtoOptions<Model> {
  dto: object
  model: ModelClassType<Model>
  version?: EXPOSE_VERSIONS
  validatorOptions?: ValidatorOptions
}

export interface ValidateIdOptions<Model> {
  idBy: IdBy
  model: ModelClassType<Model>
  version: EXPOSE_VERSIONS
}
