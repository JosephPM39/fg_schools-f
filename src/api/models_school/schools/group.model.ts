import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { IsString, Length } from 'class-validator'
import { Prom } from './prom.model'

@Exclude()
export class Group extends BaseModel {
  @Expose({
    since: EV.UPDATE, until: EV.DELETE
  })
  @IsString()
  @Length(1, 30)
    name: string
}

export interface IGroup extends Group {}
