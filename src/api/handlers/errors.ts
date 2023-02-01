import { ValidationError } from "class-validator"
import { formatValidationError } from "../validations"

interface CustomResponse {
  state: States
  success: boolean
  type: 'success' | 'info' | 'error' | 'warning'
  msg: string
  body?: object
}

export type Status = 102 | 201 | 200 | 401 | 404 | 400 | 500 | 999

export enum States {
  processing = 'PROCESSING',
  created = 'CREATED',
    ok = 'OK',
    forbidden = 'FORBIDDEN',
    notFound = 'NOT_FOUND',
    badData = 'BAD_DATA',
    serverError = 'SERVER_ERROR',
    systemError = 'SYSTEM_ERROR',
}

export const Responses : {
  [key in Status]: CustomResponse
} = {
  102: {
    success: false,
    state: States.processing,
    type: 'info',
    msg: 'La petición ya se encuentra en procesamiento'
  },
  201: {
    success: true,
    state: States.created,
    type: 'success',
    msg: 'Datos Creados'
  },
  200: {
    success: true,
    state: States.ok,
    type: 'success',
    msg: 'Todo correcto'
  },
  401: {
    success: false,
    state: States.forbidden,
    type: 'warning',
    msg: 'No tienes permisos'
  },
  404: {
    success: false,
    state: States.notFound,
    type: 'warning',
    msg: 'Elemento no encontrado'
  },
  400: {
    success: false,
    state: States.badData,
    type: 'warning',
    msg: 'Datos incorrectos'
  },
  500: {
    success: false,
    state: States.serverError,
    type: 'error',
    msg: 'Error del servidor, comuníquese con el administrador'
  },
  999:
  {
    success: false,
    state: States.systemError,
    type: 'error',
    msg: 'Error desconocido, comuníquese con el administrador'
  }
}

export enum ErrorType {
  apiResponse = 'Problemas con el servidor',
  validation = 'Error de validación',
  unknow = 'Error desconocido'
}


export function isCustomError(e: unknown): e is CustomError {
  return (e as CustomError).type !== undefined
}

export function isResponseError(e: unknown): e is ResponseError {
  return (e as ResponseError).type === ErrorType.apiResponse
}

export function isInvalidDataError(e: unknown): e is InvalidDataError {
  return (e as InvalidDataError).type === ErrorType.validation
}

function isError(e: unknown): e is Error {
  return !!(e as Error).name && !(e as CustomError).type
}

export class CustomError extends Error {
  constructor (
    public type: ErrorType = ErrorType.unknow,
    ...args: ConstructorParameters<typeof Error>
  ) {
    super(...args)
  }
}

export class ResponseError extends CustomError {
  constructor (
    public response: CustomResponse,
    ...args: ConstructorParameters<typeof Error>
  ) {
    super(ErrorType.apiResponse, ...args)
  }
}

export class InvalidDataError extends CustomError {
  constructor (
    public validationError: ValidationError | ValidationError[],
    ...args: ConstructorParameters<typeof Error>
  ) {
    super(ErrorType.validation, ...args)
  }

  getErrors = () => formatValidationError(this.validationError)
}

export type ErrorCatched = ResponseError | InvalidDataError | CustomError

const convertError = (e: any) => {
  if (isResponseError(e)) return e
  if (isInvalidDataError(e)) return e
  if (isCustomError(e)) return e

  if (e instanceof Error) {
    const newE = new CustomError()
    newE.message = e.message
    newE.stack = e.stack
    newE.cause = e.cause
    newE.name = e.name
    return newE
  }
  return new CustomError(ErrorType.unknow, e.message ?? 'Error desconocido')
}

export const functionHandleError = <T extends (...args: any) => any>(
  onThrow: (e: ErrorCatched) => void,
  cb: T,
  ...args: Parameters<T>
): ReturnType<T> | undefined => {
  try {
    const res = cb(...args)
    return res
  } catch (e: any) {
    onThrow(convertError(e))
  }
}

export const promiseHandleError = async <T extends (...args: any) => Promise<any>>(
  onThrow: (e: ErrorCatched) => void,
  cb: T,
  ...args: Parameters<T>
): Promise<Awaited<ReturnType<T>> | undefined> => {
  try {
    const res = await cb(...args)
    return res
  } catch (e: any) {
    onThrow(convertError(e))
  }
}

export const functionCatchError = <T extends (...args: any) => any>(cb: T, ...args: Parameters<T>): ReturnType<T> | ErrorCatched => {
  try {
    const res = cb(...args)
    return res
  } catch (e: any) {
    return convertError(e)
  }
}

export const promiseCatchError = async <
  T extends (...args: any) => Promise<any>
>(cb: T, ...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | ErrorCatched> => {
  try {
    const res = await cb(...args)
    return res
  } catch (e: any) {
    return convertError(e)
  }
}
