import { useEffect, useState } from "react"
import { StorageFileRequest } from "../../api/services"
import { LocalFilesRequest } from "../../api/services/files"
import { useNetStatus } from "../useNetStatus"

export const useStorageFile = () => {
  const { isAppOffline } = useNetStatus()
  const localFR = new LocalFilesRequest('')
  const [dirHandler, setDirHandler] = useState<FileSystemDirectoryHandle>()
  const [needPick, setNeedPick] = useState(!dirHandler && isAppOffline())

  useEffect(() => {
    if (dirHandler) return
    if (needPick) return
    setNeedPick(true)
    return () => {}
  }, [dirHandler, isAppOffline, needPick])

  const pickDir = () => {
    if (dirHandler) return
    localFR.pickDir().then((h) => setDirHandler(h))
  }

  const newStorage = (subDir: string) => {
    if (!dirHandler) return
    return new StorageFileRequest(subDir, isAppOffline(), dirHandler)
  }

  return {
    newStorage,
    needPick,
    pickDir
  }
}
