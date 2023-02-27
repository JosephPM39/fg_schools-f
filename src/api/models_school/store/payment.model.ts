import { Exclude, Expose, Type } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { IsDate, IsNumber, IsOptional, IsString, IsUUID, Length, Max, Min, ValidateNested } from 'class-validator'
import { IOrder, Order } from './order.model'

@Exclude()
export class Payment extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    orderId: IOrder['id']

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsNumber()
  @Max(9999.99)
  @Min(0.01)
    total: number

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsString()
  @Length(1, 254)
    details: string

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
    date: Date

  // RELATIONS

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateNested()
    order?: Order
}

export interface IPayment extends Payment {}
