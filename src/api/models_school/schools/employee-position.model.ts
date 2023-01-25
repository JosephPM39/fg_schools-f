import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { Employee, IEmployee } from './employee.model'
import { IPosition, Position } from './position.model'
import { IsOptional, IsUUID, ValidateNested } from 'class-validator'
import { EXPOSE_VERSIONS as EV } from '../../types'

@Exclude()
export class EmployeePosition extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    employeeId: IEmployee['id']

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    positionId: IPosition['id']

  // RELATIONS

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @IsOptional()
  @ValidateNested()
    employee?: Employee | undefined

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @IsOptional()
  @ValidateNested()
    position?: Position | undefined
}

export interface IEmployeePosition extends EmployeePosition {}
