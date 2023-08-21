import { ApiFilesRequest, LocalFilesRequest } from './files'
import { UploadFileParams, UploadFileReturn } from './types'

export class StorageFileRequest {
  private readonly local = new LocalFilesRequest(this.subDir, this.dirHandler)
  private readonly api = new ApiFilesRequest(this.subDir)

  constructor (
    private readonly subDir: string,
    private readonly offline: boolean,
    private readonly dirHandler?: FileSystemDirectoryHandle
  ) {}

  getList = async () => {
    if (!this.offline) {
      return await this.api.getList()
    }
    return await this.local.getList()
  }

  save = async <T extends UploadFileParams>(p: T): Promise<UploadFileReturn<T>> => {
    if (!this.offline) {
      return await this.api.upload(p)
    }
    return await this.local.upload(p)
  }

  getUrl = async (name: string) => {
    if (!this.offline) {
      return await this.api.getDownloadUrl(name)
    }
    return await this.local.getFileUrl(name)
  }

  getPreviewUrl = async (name: string) => {
    if (!this.offline) {
      return await this.api.getPreviewUrl(name)
    }
    return await this.local.getFileUrl(name)
  }

  makeUrl = async (name: string) => {
    if (!this.offline) {
      return this.api.makeDownloadUrl(name)
    }
    return await this.local.getFileUrl(name)
  }

  makePreviewUrl = async (name: string) => {
    if (!this.offline) {
      return this.api.makePreviewUrl(name)
    }
    return await this.local.getFileUrl(name)
  }

  delete = async (name: string): Promise<boolean> => {
    if (!this.offline) {
      return await this.api.delete(name)
    }
    return await this.local.delete(name)
  }
}
