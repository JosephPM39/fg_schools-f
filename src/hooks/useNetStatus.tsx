import { useEffect, useState } from "react"

export enum AppNetStatus {
  mountOffline = 'mount-offline',
  mountError = 'mount-error',
  unmountOffline = 'unmount-offline',
  unmountError = 'unmount-error',
  online = 'online',
  offline = 'offline',
}
interface Error {
  [key: string]: string | undefined
}

interface AppNetError extends Error {
  title: string
  details?: string
  callstack?: string
}

const dispatch = (ev: string = 'storage') => {
  window.dispatchEvent(new Event(ev))
}

function getLS<T>(k: string): T | null {
  const res = window.localStorage.getItem(k)
  return res ? JSON.parse(res) as T : null
}

function setLS<T>(k: string, v: T) {
  window.localStorage.setItem(k, JSON.stringify(v))
  dispatch()
}

function removeLS(k: string) {
  window.localStorage.removeItem(k)
  dispatch()
}

export const useNetStatus = () => {
  const [appNetStatus, setAppNetStatus] = useState<AppNetStatus>(getLS<AppNetStatus>('app-net-status') ?? AppNetStatus.online)
  const [isBrowserOnline, setBrowserOnline] = useState(navigator.onLine)
  const [appNetErrors, setAppNetErrors] = useState<AppNetError[] | null>(getLS<AppNetError[]>('app-net-errors'))

  useEffect(() => {
    const offlineHandler = () => {
      setBrowserOnline(false)
    }

    const onlineHandler = () => {
      setBrowserOnline(true)
    }

    window.addEventListener('offline', offlineHandler)
    window.addEventListener('online', onlineHandler)

    return () => {
      window.removeEventListener('online', onlineHandler)
      window.removeEventListener('offline', offlineHandler)
    }
  }, [])


  useEffect(() => {
    const storageHandler = () => {
      const status = getLS<AppNetStatus>('app-net-status')
      if (status && status !== appNetStatus) {
        setAppNetStatus(status)
      }

      const errors = getLS<AppNetError[]>('app-net-status')
      const newErrors = () => {
        if(appNetErrors && Array.isArray(errors)) {
          return errors.filter(
            (e, i) => e.title !== appNetErrors[i].title
          ).length > 0
        }
        return (!appNetErrors && Array.isArray(errors))
      }
      if (newErrors()) {
        setAppNetErrors(errors)
      }
    }

    window.addEventListener('storage', storageHandler)

    return () => {
      window.removeEventListener('storage', storageHandler)
    }
  }, [appNetErrors, appNetErrors?.length, appNetStatus])

  const setAppNetStatusHelper = (st: AppNetStatus) => {
    setLS<AppNetStatus>('app-net-status', st)
  }

  const changeAppNetStatus = (st: Exclude<AppNetStatus, AppNetStatus.unmountOffline | AppNetStatus.mountOffline>) => {
    setAppNetStatusHelper(st)
  }

  const isAppOffline = () => {
    return appNetStatus === AppNetStatus.offline
  }

  const isAppNetStatus = (st: AppNetStatus) => {
    return appNetStatus === st
  }

  const toggleOfflineMode = () => {
    if (!isBrowserOnline) {
      console.log('Denied')
      return reportErrors([{
        title: 'Fallo al activar modo offline',
        details: 'No hay conexión a internet para preparar el modo offline'
      }])
    }
    if (isAppOffline()) {
      return setAppNetStatusHelper(AppNetStatus.unmountOffline)
    }
    return setAppNetStatusHelper(AppNetStatus.mountOffline)
  }

  const reportErrors = (errors: AppNetError[]) => {
    setLS<AppNetError[]>('app-net-errors', errors)
  }

  const clearErrors = () => {
    removeLS('app-net-errors')
  }

  return {
    appNetErrors,
    appNetStatus,
    isAppOffline,
    isAppNetStatus,
    isBrowserOnline,
    setAppNetStatus: changeAppNetStatus,
    toggleOfflineMode,
    reportErrors,
    clearErrors
  }
}
