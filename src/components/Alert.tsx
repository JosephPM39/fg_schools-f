import { AlertTitle, Alert as AlertMUI, Snackbar, Slide } from "@mui/material"
import { CustomError, isResponseError, isInvalidDataError, InvalidDataError, ResponseError } from "../api/handlers/errors"

export interface AlertProps {
  title?: string
  type?: 'info' | 'warning' | 'error' | 'success'
  details?: string
}

export interface AlertWithError {
  error: CustomError
}

interface BaseParams {
  show?: boolean
  onClose: () => void
}

type AlertParams = BaseParams & (AlertProps | AlertWithError)

export function isAlertWithError(p: AlertProps | AlertWithError): p is AlertWithError {
  return (p as AlertWithError).error !== undefined
}

function isWithError(params: AlertParams): params is (BaseParams & AlertWithError) {
  return (params as (BaseParams & AlertWithError)).error !== undefined
}

function getNotifyMsg(e: CustomError | ResponseError | InvalidDataError): AlertProps {
  if (isResponseError(e)) {
    return {
      title: e.message,
      details: e.response.msg,
      type: e.response.type
    }
  }
  if (isInvalidDataError(e)) {
    return {
      title: e.type,
      details: 'Revisa bien los datos que has ingresado',
      type: 'warning'
    }
  }
  return {
    title: e.name,
    details: e.message,
    type: 'error'
  }
}

export const Alert = (params: AlertParams) => {
  const finalParams = isWithError(params)
    ? { ...params, ...getNotifyMsg(params.error)}
    : params
  const {
    title,
    details,
    type,
    onClose,
    show
  } = finalParams

  return <>
    <Snackbar open={show} TransitionComponent={Slide}>
      <AlertMUI onClose={onClose} severity={type ?? 'info'}>
        <AlertTitle>{title ?? 'Ha ocurrido algo'}</AlertTitle>
        {details ?? ''}
      </AlertMUI>
    </Snackbar>
  </>
}
