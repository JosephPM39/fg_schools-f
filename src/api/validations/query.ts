import { Expose, Exclude, Type } from 'class-transformer'
import { IsInt, IsOptional, IsIn } from 'class-validator'

@Exclude()
export class Query {
  @Expose()
  @IsOptional()
    limit: string

  @Expose()
  @IsOptional()
    offset: string

  @Expose()
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
    order: 'ASC' | 'DESC'
}

export interface IQuery extends Partial<Query> {}
