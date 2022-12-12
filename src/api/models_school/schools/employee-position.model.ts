import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { Employee } from './employee.model'
import { Position } from './position.model'
import { IsUUID } from 'class-validator'

@Exclude()
export class EmployeePosition extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.GET })
  @IsUUID()
    employee: Employee

  @Expose({ since: EV.UPDATE, until: EV.GET })
  @IsUUID()
    position: Position
}

export interface IEmployeePosition extends EmployeePosition {}
