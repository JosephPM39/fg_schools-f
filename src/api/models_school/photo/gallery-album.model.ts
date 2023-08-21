import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'

import { IsBoolean, IsOptional, IsUUID, ValidateNested } from 'class-validator'
import { Gallery, IGallery } from './gallery.model'
import { Album, IAlbum } from './album.model'

@Exclude()
export class GalleryAlbum extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    galleryId: IGallery['id']

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsUUID()
    albumId: IAlbum['id']

  @Expose({ since: EV.UPDATE, until: EV.CREATE_NESTED })
  @IsBoolean()
    public: boolean

  // RELATIONS

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @IsOptional()
  @ValidateNested()
    gallery?: Gallery

  @Expose({ since: EV.CREATE_NESTED, until: EV.DELETE })
  @IsOptional()
  @ValidateNested()
    album?: Album
}

export interface IGalleryAlbum extends GalleryAlbum {}
