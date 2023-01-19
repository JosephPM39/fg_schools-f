import { useEffect, useState } from "react"

const toBool = (value?: string | null) => value?.toLowerCase() === 'true'

export const useNetStatus = () => {
  const [offlineMode, setOfflineMode] = useState(toBool(localStorage.getItem('offline')))
  const [netOnline, setNetOnline] = useState(navigator.onLine)

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
      console.log('offlimeno handler')
      if (offline && toBool(offline) !== offlineMode) {
        console.log('seupt offlineMode')
        setOfflineMode(toBool(offline))
      }
    }
    window.onstorage = () => {
    // When local storage changes, dump the list to
    // the console.
      console.log(window.localStorage.getItem('offline'), 'seeing');
    };

    window.addEventListener('storage', storageHandler)

    return () => {
      window.removeEventListener('storage', storageHandler)
    }
  }, [offlineMode])

  const toggleOfflineMode = () => {
    if (offlineMode) {
      return goOnline()
    }
    return goOffline()
  }

  const goOffline = () => {
    localStorage.setItem('offline', String(true))
    window.dispatchEvent(new Event('storage'))
  }

  const goOnline = () => {
    localStorage.setItem('offline', String(false))
    window.dispatchEvent(new Event('storage'))
  }

  return {
    goOnline,
    goOffline,
    offlineMode,
    netOnline,
    toggleOfflineMode
  }
}
