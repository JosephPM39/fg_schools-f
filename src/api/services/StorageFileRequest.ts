import { ApiFilesRequest, LocalFilesRequest } from "./files"
import { UploadFileParams, UploadFileReturn } from "./types"

export class StorageFileRequest {
  local = new LocalFilesRequest(this.subDir)
  api = new ApiFilesRequest(this.subDir)

  constructor (
    private subDir: string,
    private offline: boolean
  ) {}

  save = <T extends UploadFileParams>(p: T): Promise<UploadFileReturn<T>> => {
    if (!this.offline) {
      return this.api.upload(p)
    }
    return this.local.upload(p)
  }

  getUrl = (name: string) => {
    if (!this.offline) {
      return this.api.getDownloadUrl(name)
    }
    return this.local.getFileUrl(name)
  }

  getPreviewUrl = (name: string) => {
    if (!this.offline) {
      return this.api.getPreviewUrl(name)
    }
    return this.local.getFileUrl(name)
  }

  delete = (name: string): Promise<boolean> => {
    if (!this.offline) {
      return this.api.delete(name)
    }
    return this.local.delete(name)
  }
}
