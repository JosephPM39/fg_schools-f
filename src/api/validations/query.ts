import { Expose, Exclude, Type } from 'class-transformer'
import { IsInt, IsOptional, IsIn } from 'class-validator'
import { IsIntOrIn } from './custom-decorators'

export enum ByOperator {
  equal = 'EQUAL',
  notEqual = 'NOT_EQUAL',
  lessThan = 'LESS_THAN',
  moreThan = 'MORE_THAN',
  like = 'LIKE',
  iLike = 'ILIKE'
}

const byOperator = [
  ByOperator.equal,
  ByOperator.notEqual,
  ByOperator.lessThan,
  ByOperator.moreThan,
  ByOperator.like,
  ByOperator.iLike
]

export enum Order {
  desc = 'DESC',
  asc = 'ASC'
}

const order = [
  Order.desc,
  Order.asc
]

@Exclude()
export class Query {
  @Expose()
  @IsOptional()
  @IsIntOrIn('limit', ['NONE'])
    limit: string | 'NONE'

  @Expose()
  @IsOptional()
  @IsIn(byOperator)
    byoperator: ByOperator

  @Expose()
  @Type(() => Number)
  @IsInt()
  @IsOptional()
    offset: string

  @Expose()
  @Type(() => String)
  @IsIn(order)
  @IsOptional()
    order: Order
}

export interface IQuery extends Partial<Query> {}
