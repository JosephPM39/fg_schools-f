import { useRef } from "react"

export const useDebounce = () => {
  const timeout = useRef<number | undefined>()

  const debounce = (cb: Function, time?: number) => {
    window.clearTimeout(timeout.current)
    timeout.current = window.setTimeout(() => {
      cb()
    }, time ?? 500)
  }

  function promiseHelper<T>(cb?: Promise<T>, time?: number) {
    if (!cb) return
    return new Promise<T>((res, rej) => debounce(() => {
      cb.then(
        (r) => res(r)
      ).catch(
        (e) => rej(e)
      )
    }, time))
  }

  return {
    debounce,
    promiseHelper
  }
}
