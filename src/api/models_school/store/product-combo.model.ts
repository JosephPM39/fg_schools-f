import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { IsBoolean, IsInt, IsUUID, Max, Min, ValidateNested } from 'class-validator'
import { Combo, ICombo } from './combo.model'
import { IProduct, Product } from '../products'

@Exclude()
export class ProductCombo extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    comboId: ICombo['id']

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    productId: IProduct['id']

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsInt()
  @Max(9999)
  @Min(1)
    amount: number

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsBoolean()
    inOffer: boolean

  // RELATIONS

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateNested()
    combo?: Combo

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateNested()
    product?: Product
}

export interface IProductCombo extends ProductCombo {}
