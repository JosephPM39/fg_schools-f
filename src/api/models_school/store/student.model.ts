import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { IsOptional, IsString, Length } from 'class-validator'

@Exclude()
export class Student extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsString()
  @Length(1, 40)
    firstName: string

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsString()
  @Length(1, 40)
    lastName: string

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsString()
  @IsOptional()
  @Length(1, 100)
    nickName: string
}

export interface IStudent extends Student {}
