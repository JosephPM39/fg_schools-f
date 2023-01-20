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

export interface ResponseType {
  [key: number]: {
    state: string
    success: boolean
    type: 'success' | 'info' | 'error' | 'warning'
    msg: string
  }
}

export const ResponseMSG = {
  102: {
    success: false,
    state: 'PROCESSING',
    type: 'info',
    msg: 'La petición ya se encuentra en procesamiento'
  },
  201: {
    success: true,
    state: 'CREATED',
    type: 'success',
    msg: 'Datos Creados'
  },
  200: {
    success: true,
    state: 'OK',
    type: 'success',
    msg: 'Todo correcto'
  },
  401: {
    success: false,
    state: 'FORBIDDEN',
    type: 'warning',
    msg: 'No tienes permisos'
  },
  404: {
    success: false,
    state: 'NOT_FOUND',
    type: 'warning',
    msg: 'Elemento no encontrado'
  },
  400: {
    success: false,
    state: 'BAD_DATA',
    type: 'warning',
    msg: 'Datos incorrectos'
  },
  500: {
    success: false,
    state: 'SERVER_ERROR',
    type: 'danger',
    msg: 'Error del servidor, comuníquese con el administrador'
  },
  999:
  {
    success: false,
    state: 'SYSTEM_ERROR',
    type: 'danger',
    msg: 'Error desconocido, comuníquese con el administrador'
  }
}
