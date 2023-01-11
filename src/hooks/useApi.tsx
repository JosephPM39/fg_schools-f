import { useState, useEffect } from "react"
import { useSchool } from "./api/schools/useSchool"
import { useEmployeePosition } from "./api/schools/useEmployeePosition"
import { useEmployee } from "./api/schools/useEmployee"
import { useTitle } from "./api/schools/useTitle"
import { useGroup } from "./api/schools/useGroup"
import { usePosition } from "./api/schools/usePosition"
import { useSectionProm } from "./api/schools/useSectionProm"
import { useSchoolProm } from "./api/schools/useSchoolProm"

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
    useSchool: useSchool(),
    useSchoolProm: useSchoolProm(),
    useSectionProm: useSectionProm(),
    useEmployee: useEmployee(),
    useTitle: useTitle(),
    useGroup: useGroup(),
    useEmployeePosition: useEmployeePosition(),
    usePosition: usePosition()
  }
}
