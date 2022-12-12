import { IsDate, IsOptional, IsUUID } from 'class-validator'
import { Expose, Exclude } from 'class-transformer'
import { EXPOSE_VERSIONS } from '../types'

@Exclude()
export class BaseModel {
  @Expose({ since: EXPOSE_VERSIONS.CREATE })
  @IsOptional()
  @IsUUID()
    id?: string

  // This doesn't exists into real API, this is used to distinguish
  // offline data from data retrieved from the api
  @Expose({ since: EXPOSE_VERSIONS.UPDATE })
  @IsOptional()
    offline?: boolean

  @Expose({ since: EXPOSE_VERSIONS.FULL })
  @IsOptional()
  @IsDate()
    createdAt?: Date

  @Expose({ since: EXPOSE_VERSIONS.FULL })
  @IsOptional()
  @IsDate()
    updatedAt?: Date

  @Expose({ since: EXPOSE_VERSIONS.FULL })
  @IsOptional()
  @IsDate()
    deletedAt?: Date
}

export interface IBaseModel extends BaseModel {}
