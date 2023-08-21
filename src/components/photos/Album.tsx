import { useContext, useEffect, useState } from 'react'
import { ImageList, Image } from '../ImageList'
import { SubDir } from '../../hooks/api/files/useStorageFile'
import { IAlbum } from '../../api/models_school'
import { StorageFileRequest } from '../../api/services'
import { StorageFileContext } from '../../context/files/StorageFilesContext'
import { FileList } from '../../api/services/types'

interface AlbumParams {
  albumId: IAlbum['id']
}

export const Album = (params: AlbumParams) => {
  const { albumId } = params
  const [images, setImages] = useState<Image[]>([])
  const [fileList, setFileList] = useState<FileList>([])
  const [storage, setStorage] = useState<StorageFileRequest | null>(null)
  const useStorageFiles = useContext(StorageFileContext)

  useEffect(() => {
    const getData = async () => {
      if (!useStorageFiles) return
      if (!albumId) return
      setStorage(useStorageFiles.newStorage(`${SubDir.albums}/${albumId}`))
    }
    void getData()
  }, [albumId])

  useEffect(() => {
    if (!storage) return
    const getData = async () => {
      const res = await storage.getList()
      setFileList(res)
    }
    void getData()
  }, [storage])

  useEffect(() => {
    const images: Image[] = fileList.map((item) => ({
      imgUrl: item.urlPreview ?? item.url,
      title: item.name,
      imgName: item.name
    }))

    setImages(images)
  }, [fileList])

  return <ImageList images={images} />
}
