import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { IsString, Length } from 'class-validator'

@Exclude()
export class Title extends BaseModel {
  @Expose({
    since: EV.UPDATE,
    until: EV.CREATE_NESTED
  })
  @IsString()
  @Length(1, 100)
    name: string
}

export interface ITitle extends Title {}
