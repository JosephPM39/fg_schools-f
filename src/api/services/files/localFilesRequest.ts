import { v4 as uuidV4 } from 'uuid'
import { UploadSingleFileResponse, FileList, UploadFileReturn, UploadFileParams } from '../types'
import { getFileExtension } from '../utils'

export class LocalFilesRequest {

  private subDirHandler: FileSystemDirectoryHandle

  constructor(
    private subDir: string,
    private dirHandler?: FileSystemDirectoryHandle
  ) {
    if (this.dirHandler) {
      this.loadDir(this.dirHandler)
    }
  }

  loadDir = async (handler?: FileSystemDirectoryHandle) => {
    const h = handler ?? await this.pickDir()
    this.subDirHandler = await h.getDirectoryHandle(this.subDir, {create: true})
    this.subDirHandler.requestPermission({ mode: 'readwrite' })
  }

  pickDir = async () => {
    const handler = await window.showDirectoryPicker({
      startIn: 'pictures',
    })
    await handler.requestPermission({ mode: 'readwrite' })
    return handler
  }

  private write = async (file: File, uuidName: boolean = false): Promise<UploadSingleFileResponse> => {
    let name = uuidName
      ? `${uuidV4()}.${getFileExtension(file.name)}`
      : file.name
    const handle = await this.subDirHandler.getFileHandle(name, {create: true})
    const writable = await handle.createWritable()
    await writable.write(file)
    await writable.close()

    return {
      message: 'Success created file',
      name: {
        original: file.name,
        savedAs: name
      }
    }
  }

  upload = async <T extends UploadFileParams>(file: T): Promise<UploadFileReturn<T>> => {
    if (!Array.isArray(file)) {
      return await this.write(file, false) as unknown as UploadFileReturn<T>
    }
    const res = await Promise.all(file.map((f) => this.write(f, false)))
    return {
      message: res[0].message,
      names: {
        ...res.map((r) => r.name)
      }
    } as unknown as UploadFileReturn<T>
  }

  getList = async (): Promise<FileList> => {
    const files = this.subDirHandler.values()
    const list: FileList = []
    for await (const file of files) {
      if (file.kind === 'file') {
        const url = URL.createObjectURL(await file.getFile())
        list.push({
          name: file.name,
          url,
          urlPreview: url
        })
      }
    }
    return list
  }

  getFile = async (name: string) => {
    const handle = await this.subDirHandler.getFileHandle(name)
    return await handle.getFile()
  }

  getFileUrl = async (name: string) => {
    const file = await this.getFile(name)
    return URL.createObjectURL(file)
  }

  delete = async (name: string) => {
    await this.subDirHandler.removeEntry(name)
    return true
  }
}
