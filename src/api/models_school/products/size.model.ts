import { Exclude, Expose } from 'class-transformer'
import { BaseModel } from '../base.model'
import { EXPOSE_VERSIONS as EV } from '../../types'
import { IsBoolean, IsInt, IsNumber, IsString, Length, Max, Min } from 'class-validator'

@Exclude()
export class Size extends BaseModel {
  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsString()
  @Length(1, 50)
    name: string

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsNumber()
  @Max(9999.99999)
  @Min(0.5)
    width: number

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsNumber()
  @Max(9999.99999)
  @Min(0.5)
    height: number

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsInt()
  @Max(1200)
  @Min(1)
    ppp: number

  @Expose({ since: EV.UPDATE, until: EV.DELETE })
  @IsBoolean()
    available: boolean
}

export interface ISize extends Size {}
