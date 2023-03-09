import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { IsUUID, ValidateIf, ValidateNested } from 'class-validator'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { Group, IGroup } from './group.model'
import { EmployeePosition, IEmployeePosition } from './employee-position.model'
import { ITitle, Title } from './title.model'
import { ISchoolProm, SchoolProm } from './school-prom.model'

@Exclude()
export class SectionProm extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    groupId: IGroup['id']

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    titleId: ITitle['id']

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    profesorId: IEmployeePosition['id']

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    schoolPromId: ISchoolProm['id']

  // RELATIONS

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateIf(o => !o.groupId)
  @ValidateNested()
    group: Group

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateIf(o => !o.titleId)
  @ValidateNested()
    title: Title

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateIf(o => !o.profesorId)
  @ValidateNested()
    profesor: EmployeePosition

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateIf(o => !o.schoolId)
  @ValidateNested()
    schoolProm: SchoolProm
}

export interface ISectionProm extends SectionProm {}
