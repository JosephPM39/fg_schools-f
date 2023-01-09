import { ValidationOptions, registerDecorator, ValidationArguments, isInt, isIn } from 'class-validator'

const intHelper = (n: any) => {
  try {
    return isInt(parseInt(n))
  } catch {
    return false
  }
}

export const IsIntOrIn = (property: string, values: any[], validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isIntOrIn',
      target: object.constructor,
      constraints: [property],
      propertyName,
      options: {
        message: `${propertyName} must be a number or in [${String(values.reduce((p, c) => `${String(p)}, ${String(c)}`, ''))}]`,
        ...validationOptions
      },
      validator: {
        validate (value: any, args: ValidationArguments) {
          return intHelper(value) || isIn(value, values)
        }
      }
    })
  }
}
