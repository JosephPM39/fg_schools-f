import { MenuItemProps } from '@mui/material'
import { IBaseModel } from '../../../api/models_school/base.model'
import { useBase } from '../../../hooks/api/useBase'
import { LazyOption, Option, Params } from '../ComboBox/types'
export type {
  Option,
  LazyOption
} from '../ComboBox/types'

type OmitParamsComboBox = 'isLoading' | 'onToggleOpen' | 'onSearch' | 'searchMaxLength' | 'renderOption'

export type SelectParams<
  T extends IBaseModel,
  KV extends keyof T = 'id',
  O extends LazyOption<T, KV> | Option<T> = Option<T>
> = Omit<Params<T, KV, O>, OmitParamsComboBox> & {
  renderOption?: (props: { option: O } & MenuItemProps) => JSX.Element
  required?: boolean
}

type OmitParamsSelect = 'renderOption' | 'onChange' | 'defaultValue' | 'options'

export type SelectLazyParams<
  T extends IBaseModel,
  KV extends keyof T = 'id',
> = Omit<SelectParams<T, KV, LazyOption<T, KV>>, OmitParamsSelect> & {
  itemLabelBy: keyof T | ((item: T) => string | Promise<string>)
  itemValueBy?: KV
  paginate?: () => void
  onChange?: (item?: T) => void
  onCreate?: () => void
  defaultValue?: T['id']
  omitCreateOption?: true
  hook: ReturnType<typeof useBase<T>>
  size?: 'small' | 'medium'
}
