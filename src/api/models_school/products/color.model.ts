import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { IsBoolean, IsString, Length, IsOptional } from 'class-validator'

@Exclude()
export class Color extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsString()
  @Length(1, 30)
    name: string

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsString()
  @Length(7, 9)
    hex: string

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsString()
  @IsOptional()
  @Length(1, 100)
    sample: string

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsBoolean()
    available: boolean
}

export interface IColor extends Color {}
