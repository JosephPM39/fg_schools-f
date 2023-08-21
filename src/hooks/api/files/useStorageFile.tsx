import { useEffect, useState } from 'react'
import { StorageFileRequest } from '../../../api/services'
import { LocalFilesRequest } from '../../../api/services/files'
import { useNetStatus } from '../../useNetStatus'

export const useStorageFile = () => {
  const { isAppOffline } = useNetStatus()
  const localFR = new LocalFilesRequest('')
  const [dirHandler, setDirHandler] = useState<FileSystemDirectoryHandle>()
  const [needPick, setNeedPick] = useState((dirHandler == null) && isAppOffline())

  useEffect(() => {
    if (dirHandler != null) return
    if (needPick || !isAppOffline()) return
    setNeedPick(true)
    return () => {}
  }, [dirHandler, isAppOffline, needPick])

  const pickDir = () => {
    if ((dirHandler != null) || !isAppOffline()) return
    void localFR.pickDir().then((h) => setDirHandler(h))
  }

  const newStorage = (subDir: SubDir | string) => {
    return new StorageFileRequest(subDir, isAppOffline(), dirHandler)
  }

  return {
    newStorage,
    needPick,
    pickDir
  }
}

export enum SubDir {
  schoolIcons = 'school-icon',
  albums = 'albums'
}
