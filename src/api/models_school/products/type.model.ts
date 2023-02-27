import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { IsBoolean, IsString, Length } from 'class-validator'

@Exclude()
export class Type extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsString()
  @Length(1, 50)
    name: string

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsBoolean()
    available: boolean
}

export interface IType extends Type {}
