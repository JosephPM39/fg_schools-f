import { useEffect, useState } from "react"

const toBool = (value?: string | null) => value?.toLowerCase() === 'true'

export const useNetStatus = () => {
  const [offlineMode, setOfflineMode] = useState(toBool(localStorage.getItem('offline')))
  const [netOnline, setNetOnline] = useState(navigator.onLine)
  const [initOffline, setInitOffline] = useState(toBool(localStorage.getItem('offline-init')))

  useEffect(() => {
    const offlineHandler = () => {
      setNetOnline(false)
    }

    const onlineHandler = () => {
      setNetOnline(true)
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
      const offline = window.localStorage.getItem('offline')
      const offlineInit = window.localStorage.getItem('offline-init')
      if (offline && toBool(offline) !== offlineMode) {
        setOfflineMode(toBool(offline))
      }
      if (offlineInit && toBool(offlineInit) !== initOffline) {
        setInitOffline(toBool(offlineInit))
      }
    }

    window.addEventListener('storage', storageHandler)

    return () => {
      window.removeEventListener('storage', storageHandler)
    }
  }, [offlineMode, initOffline])

  const toggleOfflineMode = () => {
    if (offlineMode) {
      return goOnline()
    }
    return goOffline()
  }

  const goOffline = () => {
    localStorage.setItem('offline', String(true))
  }

  const goOnline = () => {
    localStorage.setItem('offline', String(false))
  }

  return {
    goOnline,
    goOffline,
    offlineMode,
    netOnline,
    toggleOfflineMode
  }
}
