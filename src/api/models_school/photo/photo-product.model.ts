import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'

import { IsOptional, IsString, IsUUID, Length, ValidateNested } from 'class-validator'
import { IProduct, Product } from '../products'
import { Album, IAlbum } from './album.model'

@Exclude()
export class PhotoProduct extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsString()
  @Length(1, 20)
    code: string

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    albumId: IAlbum['id']

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    productId: IProduct['id']

  // RELATIONS

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @IsOptional()
  @ValidateNested()
    album?: Album

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @IsOptional()
  @ValidateNested()
    product?: Product
}

export interface IPhotoProduct extends PhotoProduct {}
