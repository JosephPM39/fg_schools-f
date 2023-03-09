import { IEmployee, IEmployeePosition, IPosition, ISchool } from '../../api/models_school'

export interface SchoolsCardData {
  school?: ISchool
  principal?: {
    position?: IPosition
    employee?: IEmployee
    relation?: IEmployeePosition
  }
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends ReadonlyArray<infer ElementType> ? ElementType : never

export type WithRequired<T, K extends keyof T> = {
  [P in keyof T]?: T[P] | undefined
} & {
  [P in K]-?: T[P]
}
