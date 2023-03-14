import { IBaseModel } from '../../../api/models_school/base.model'
import { useBase } from '../../../hooks/api/useBase'

export interface Option<T extends IBaseModel> {
  label: string
  value: T['id']
}

export interface LazyOption<T extends IBaseModel, KV extends keyof T = 'id'> {
  label: string
  id: T[KV] | 'new' | 'load'
  index: number
}

export interface LazyParams<T extends IBaseModel, KV extends keyof T = 'id'>
  extends Omit<Params<T>, 'options' | 'onToggleOpen' | 'onChange' | 'onSearch'> {
  itemLabelBy: keyof T
  itemValueBy: KV
  onChange: (item?: T[KV]) => void
  defaultValue: T[KV]
  omitCreateOption?: true
  hook: ReturnType<typeof useBase<T>>
}

export interface Params<
  T extends IBaseModel,
  KV extends keyof T = 'id',
  O extends Option<T> | LazyOption<T, KV> = Option<T>
> {
  id: string
  label: string
  options: O[]
  size?: 'small' | 'medium'
  onToggleOpen?: (open: boolean) => void
  onChange: (op: O | null) => void
  onSearch: (s: string) => void
  searchMaxLength?: number
}
