import { ApiFilesRequest, LocalFilesRequest } from "./files"
import { UploadFileParams, UploadFileReturn } from "./types"

export class StorageFileRequest {
  local = new LocalFilesRequest(this.subDir, this.dirHandler)
  api = new ApiFilesRequest(this.subDir)

  constructor (
    private subDir: string,
    private offline: boolean,
    private dirHandler?: FileSystemDirectoryHandle
  ) {}

  save = <T extends UploadFileParams>(p: T): Promise<UploadFileReturn<T>> => {
    if (!this.offline) {
      return this.api.upload(p)
    }
    return this.local.upload(p)
  }

  getUrl = async (name: string) => {
    if (!this.offline) {
      return this.api.getDownloadUrl(name)
    }
    return await this.local.getFileUrl(name)
  }

  getPreviewUrl = async (name: string) => {
    if (!this.offline) {
      return this.api.getPreviewUrl(name)
    }
    return await this.local.getFileUrl(name)
  }

  delete = (name: string): Promise<boolean> => {
    if (!this.offline) {
      return this.api.delete(name)
    }
    return this.local.delete(name)
  }
}
