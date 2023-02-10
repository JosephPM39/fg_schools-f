import { v4 as uuidV4 } from 'uuid'
import { UploadSingleFileResponse, UploadManyFileResponse, FileList } from './types'

const getFileExtension = (filename: string) => {
  const split = filename.split('.')
  if (split.length < 2) return ''
  return split.pop() ?? ''
}

type UploadReturn<T extends File | Array<File>> = T extends File ?
UploadSingleFileResponse : UploadManyFileResponse

export class FilesRequest {

  private dirHandler: FileSystemDirectoryHandle
  private subDirHandler: FileSystemDirectoryHandle

  constructor(
    private subDir: string,
  ) {

  }

  pickDir = async () => {
    this.dirHandler = await window.showDirectoryPicker({
      startIn: 'pictures',
    })
    this.dirHandler.requestPermission({ mode: 'readwrite' })
    this.subDirHandler = await this.dirHandler.getDirectoryHandle(this.subDir, {create: true})
    this.subDirHandler.requestPermission({ mode: 'readwrite' })
  }

  private write = async (file: File, uuidName: boolean = true): Promise<UploadSingleFileResponse> => {
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

  upload = async <T extends File | Array<File>>(file: T): Promise<UploadReturn<T>> => {
    if (!Array.isArray(file)) {
      return await this.write(file) as unknown as UploadReturn<T>
    }
    const res = await Promise.all(file.map((f) => this.write(f)))
    return {
      message: res[0].message,
      names: {
        ...res.map((r) => r.name)
      }
    } as unknown as UploadReturn<T>
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
  }
}
