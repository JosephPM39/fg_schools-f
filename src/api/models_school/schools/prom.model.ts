import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { IsInt, IsUUID, Max, Min } from 'class-validator'
import { School } from './school.model'
import { Group } from './group.model'
import { EmployeePosition } from './employee-position.model'
import { Title } from './title.model'

@Exclude()
export class Prom extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.GET })
  @IsUUID()
    group: Group | string

  @Expose({ since: EV.UPDATE, until: EV.GET })
  @IsUUID()
    title: Title | string

  @Expose({ since: EV.UPDATE, until: EV.GET })
  @IsUUID()
    profesor: EmployeePosition | string

  @Expose({ since: EV.UPDATE, until: EV.GET })
  @IsUUID()
    principal: EmployeePosition | string

  @Expose({ since: EV.UPDATE, until: EV.GET })
  @IsUUID()
    school: School | string

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsInt()
  @Max(9999)
  @Min(1900)
    year: number
}

export interface IProm extends Prom {}
