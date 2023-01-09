import { Expose, Exclude, Type } from 'class-transformer'
import { IsInt, IsOptional, IsIn } from 'class-validator'
import { IsIntOrIn } from './custom-decorators'

@Exclude()
export class Query {
  @Expose()
  @IsOptional()
  @IsIntOrIn('limit', ['NONE'])
    limit: string | 'NONE'

  @Expose()
  @IsOptional()
    offset: string

  @Expose()
  @Type(() => String)
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
    order: 'ASC' | 'DESC'
}

export interface IQuery extends Partial<Query> {}
