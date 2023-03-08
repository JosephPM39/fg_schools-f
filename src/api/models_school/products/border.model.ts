import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator'

@Exclude()
export class Border extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsString()
  @Length(1, 30)
    name: string

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsString()
  @IsOptional()
  @Length(1, 100)
    file?: string

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsBoolean()
    available: boolean
}

export interface IBorder extends Border {}
