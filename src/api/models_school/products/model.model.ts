import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { IsBoolean, IsNumber, IsString, Length, Max, Min } from 'class-validator'

@Exclude()
export class Model extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsString()
  @Length(1, 50)
    name: string

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsNumber()
  @Max(9999.99)
  @Min(0.01)
    offer: number

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsNumber()
  @Max(9999.99)
  @Min(0.01)
    price: number

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsBoolean()
    available: boolean
}

export interface IModel extends Model {}
