import { ButtonTypeMap, ExtendButtonBase } from "@mui/material"

type Button = ExtendButtonBase<ButtonTypeMap<{}, 'button'>>

export type BtnPropsContainer = { btnProps: Omit<Parameters<Button>[0], 'onClick'> }
export type BtnContainer = { btn: NonNullable<React.ReactNode> }
export type NoBtnContainer = { noButton: true }

type Params<T> = T & (BtnPropsContainer | BtnContainer | NoBtnContainer)

export function isBtnContainer<T>(params: Params<T>): params is T & BtnContainer {
  return typeof (params as BtnContainer & T).btn !== 'undefined'
}

export function isNoBtnContainer<T>(params: Params<T>): params is T & NoBtnContainer {
  return typeof (params as NoBtnContainer & T).noButton !== 'undefined'
}
