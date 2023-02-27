import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { IsBoolean, IsString, IsUUID, Length, ValidateNested } from 'class-validator'
import { IModel, Model } from './model.model'
import { IType, Type } from './type.model'
import { ISize, Size } from './size.model'
import { Color, IColor } from './color.model'
import { Border, IBorder } from './border.model'

@Exclude()
export class Profile extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsString()
  @Length(1, 30)
    name: string

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    modelId: IModel['id']

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    typeId: IType['id']

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    sizeId: ISize['id']

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    colorId: IColor['id']

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    borderId: IBorder['id']

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsBoolean()
    available: boolean

  // RELATIONS

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateNested()
    model?: Model

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateNested()
    type?: Type

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateNested()
    size?: Size

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateNested()
    color?: Color

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @ValidateNested()
    border?: Border
}

export interface IProfile extends Profile {}
