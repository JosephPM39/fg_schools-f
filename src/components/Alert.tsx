import { AlertTitle, Alert as AlertMUI, Snackbar, Slide } from "@mui/material"
import { CustomError, isResponseError, isInvalidDataError, isCustomError, ErrorType, InvalidDataError, ResponseError } from "../api/handlers/errors"

interface Custom {
  title?: string
  type: 'info' | 'warning' | 'error' | 'success'
  details: string
}

interface WithError {
  error: CustomError
}

interface BaseParams {
  show?: boolean
  onClose: () => void
}

type AlertParams = BaseParams & (Custom | WithError)

function isWithError(params: AlertParams): params is (BaseParams & WithError) {
  return !!(params as (BaseParams & WithError)).error
}

function getNotifyMsg(e: CustomError | ResponseError | InvalidDataError): Custom {
  if (isResponseError(e)) {
    return {
      title: e.name,
      details: e.response.msg,
      type: e.response.type
    }
  }
  if (isInvalidDataError(e)) {
    return {
      title: e.name,
      details: e.getFormat(),
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
      <AlertMUI onClose={onClose} severity={type}>
        <AlertTitle>{title ?? 'Ha ocurrido algo'}</AlertTitle>
        {details}
      </AlertMUI>
    </Snackbar>
  </>
}
