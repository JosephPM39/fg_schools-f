import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { IsString, Length } from 'class-validator'
import { EXPOSE_VERSIONS as EV } from '../../types'

@Exclude()
export class Employee extends BaseModel {
  @Expose({
    since: EV.UPDATE,
    until: EV.CREATE_NESTED
  })
  @IsString()
  @Length(1, 40)
    firstName: string

  @Expose({
    since: EV.UPDATE,
    until: EV.CREATE_NESTED
  })
  @IsString()
  @Length(1, 40)
    lastName: string

  @Expose({
    since: EV.UPDATE,
    until: EV.CREATE_NESTED
  })
  @IsString()
  @Length(1, 10)
    profesion: string

  @Expose({
    since: EV.UPDATE,
    until: EV.CREATE_NESTED
  })
  @IsString()
  @Length(1, 55)
    contact: string
}

export interface IEmployee extends Employee {}
