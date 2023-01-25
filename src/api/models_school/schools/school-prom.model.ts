import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { IsInt, IsUUID, Max, Min, ValidateIf, ValidateNested } from 'class-validator'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { ISchool, School } from './school.model'
import { EmployeePosition, IEmployeePosition } from './employee-position.model'

@Exclude()
export class SchoolProm extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    principalId: IEmployeePosition['id']

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    schoolId: ISchool['id']

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsInt()
  @Max(9999)
  @Min(1900)
    year: number

  // RELATIONS

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateIf(o => !o.principalId)
  @ValidateNested()
    principal: EmployeePosition

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateIf(o => !o.schoolId)
  @ValidateNested()
    school: School | undefined

}

export interface ISchoolProm extends SchoolProm {}
