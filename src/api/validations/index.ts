import { ValidateIdOptions, ValidateDtoOptions } from '../types'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { IQuery, Query } from './query'

export const validateIdBy = async <Model extends {}>(params: ValidateIdOptions<Model>) => {
  const { idBy, version, model } = params
  const dto = typeof idBy === 'object' ? idBy : { id: idBy }
  const valid = await validateDto<Model>({
    dto,
    model,
    version,
    validatorOptions: {
      skipMissingProperties: true,
      skipUndefinedProperties: true
    }
  })

  const propertiesAllowed = Object.keys(valid)
  const dtoProperties = Object.keys(dto)
  const rejectedProperties = dtoProperties.filter((p) => !propertiesAllowed.includes(p))

  if (rejectedProperties.length > 0) {
    const error = new Error('Invalid Search Object or id')
    error.cause = {
      propertiesAllowed,
      rejectedProperties
    }
    delete error.stack
    throw error
  }

  return valid
}

export const validateDto = async <Model extends {}>(params: ValidateDtoOptions<Model>) => {
  const { model, dto, version, transformOptions } = params
  const instance = plainToInstance(
    model as ClassConstructor<Model>,
    dto,
    { version, excludeExtraneousValues: true, exposeUnsetFields: false, ...transformOptions }
  )
  const errors = await validate(instance, params.validatorOptions)
  if (errors.length > 0) {
    const boomError = new Error('Invalid data')
    boomError.cause = {
      details: formatValidationError(errors)
    }
    delete boomError.stack
    throw boomError
  }
  return instance
}

export const validateQuery = async (query?: object | IQuery): Promise<Partial<Query> | undefined> => {
  if (!query) return undefined
  return await validateDto<Query>({
    dto: query,
    model: Query,
    validatorOptions: {
      skipMissingProperties: true,
      skipUndefinedProperties: true
    }
  })
}

const formatValidationError = (error: ValidationError[] | ValidationError) => {
  const format = (error: ValidationError) => {
    const constraints = JSON.stringify(error.constraints ?? '')

    return `{ ${JSON.stringify(error.property)}: ${JSON.stringify(String(error.value))}, "constraints": ${constraints} }`
  }

  const reduceCB = (previous: string, current: ValidationError) => {
    const pre = previous ? previous + ',' : ''
    const cu = format(current)
    return `${pre} ${cu}`
  }

  if (Array.isArray(error)) {
    const errors = `[${error.reduce(reduceCB, '')}]`
    return JSON.parse(errors)
  }

  return JSON.parse(format(error))
}
