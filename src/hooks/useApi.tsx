import { useState, useEffect } from "react"
import { useSchool } from "./api/schools/useSchool"
import { useProm } from './api/schools/useProm'
import { useEmployeePosition } from "./api/schools/useEmployeePosition"
import { useEmployee } from "./api/schools/useEmployee"
import { useTitle } from "./api/schools/useTitle"
import { useGroup } from "./api/schools/useGroup"
import { usePosition } from "./api/schools/usePosition"

export const useApi = () => {
  const [status, setStatus] = useState({
    offlineMode: false,
    netOnline: false
  })

  useEffect(() => {
    setStatus({
      offlineMode: Boolean(localStorage.getItem('offline')),
      netOnline: navigator.onLine
    })
  }, [])

  const goOffline = () => {
    localStorage.setItem('offline', String(true))
    status.offlineMode = Boolean(localStorage.getItem('offline'))
  }

  const goOnline = () => {
    localStorage.setItem('offline', String(false))
    status.offlineMode = Boolean(localStorage.getItem('offline'))
  }

  window.addEventListener('offline', (_) => {
    status.netOnline = false
  })

  window.addEventListener('online', (_) => {
    status.netOnline = true
  })

  return {
    status,
    goOffline,
    goOnline,
    useSchool: useSchool({offline: status.offlineMode}),
    useProm: useProm({offline: status.offlineMode}),
    useEmployee: useEmployee({offline: status.offlineMode}),
    useTitle: useTitle({offline: status.offlineMode}),
    useGroup: useGroup({offline: status.offlineMode}),
    useEmployeePosition: useEmployeePosition({offline: status.offlineMode}),
    usePosition: usePosition({offline: status.offlineMode})
  }
}
