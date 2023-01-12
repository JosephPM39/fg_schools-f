import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { IsIn, IsString, Length } from 'class-validator'

export enum PositionType {
  PRINCIPAL = 'Dirección',
  PROFESOR = 'Docencia'
}

export const positionTypes = [PositionType.PROFESOR, PositionType.PRINCIPAL]

@Exclude()
export class Position extends BaseModel {
  @Expose({
    since: EV.UPDATE,
    until: EV.CREATE_NESTED
  })
  @IsString()
  @Length(1, 30)
    name: string

  @Expose({
    since: EV.UPDATE,
    until: EV.CREATE_NESTED
  })
  @IsIn(positionTypes)
    type: PositionType
}

export interface IPosition extends Position {}
