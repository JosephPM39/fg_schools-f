import { useRef } from "react"

export const useThrottle = () => {
  let timeout = useRef<number | undefined>(undefined)

  const throttle = (cb: Function, time?: number) => {
    if (timeout.current) return;
    timeout.current = window.setTimeout(() => {
      cb()
      window.clearTimeout(timeout.current)
    }, time ?? 500)
  }

  function promiseHelper<T>(cb?: Promise<T>, time?: number) {
    if (!cb) return
    return new Promise<T>((res, rej) => throttle(() => {
      cb.then(
        (r) => res(r)
      ).catch(
        (e) => rej(e)
      )
    }, time))
  }

  return {
    throttle,
    promiseHelper
  }
}
