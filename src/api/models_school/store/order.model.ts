import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { IsIn, IsNumber, IsOptional, IsString, IsUUID, Length, Max, Min, ValidateNested } from 'class-validator'
import { IStudent, Student } from './student.model'
import { SectionProm, ISectionProm } from '../schools/section-prom.model'

export enum OrderType {
  STUDIO = 'Studio',
  SCHOOL = 'Escuela'
}

export const orderTypes = [OrderType.SCHOOL, OrderType.STUDIO]

@Exclude()
export class Order extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    studentId: IStudent['id']

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    sectionPromId: ISectionProm['id']

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsNumber()
  @Max(9999.99)
  @Min(0.01)
    total: number

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsNumber()
  @Max(9999.99)
  @Min(0.01)
    remaining: number

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsOptional()
  @IsString()
  @Length(1, 254)
    details: string

  @Expose({ since: EV.UPDATE, until: EV.GET_OPERATOR })
  @IsIn(orderTypes)
    type: OrderType

  // RELATIONS

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateNested()
    student?: Student

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateNested()
    sectionProm?: SectionProm
}

export interface IOrder extends Order {}
