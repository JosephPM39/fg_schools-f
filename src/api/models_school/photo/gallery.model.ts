import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'

import { IsBoolean, IsOptional, IsUUID, ValidateNested } from 'class-validator'
import { IOrder, Order } from '../store'
import { ISectionProm, SectionProm } from '../schools/section-prom.model'

@Exclude()
export class Gallery extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsOptional()
  @IsUUID()
    orderId: IOrder['id']

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsOptional()
  @IsUUID()
    sectionPromId: ISectionProm['id']

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsBoolean()
    available: boolean

  // RELATIONS

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @IsOptional()
  @ValidateNested()
    order?: Order

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @IsOptional()
  @ValidateNested()
    sectionProm?: SectionProm
}

export interface IGallery extends Gallery {}
