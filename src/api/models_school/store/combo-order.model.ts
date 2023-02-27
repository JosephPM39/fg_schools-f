import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'

import { IOrder, Order } from './order.model'
import { Combo, ICombo } from './combo.model'
import { IsUUID, ValidateNested } from 'class-validator'

@Exclude()
export class ComboOrder extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    orderId: IOrder['id']

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    comboId: ICombo['id']

  // RELATIONS

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateNested()
    order?: Order

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateNested()
    combo?: Combo
}

export interface IComboOrder extends ComboOrder {}
