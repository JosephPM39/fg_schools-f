import { CONFIG } from '../../../config'
import { FileList, UploadFileParams, UploadFileReturn } from '../types'
import { fetchOnce, throwApiResponseError } from '../utils'

const getHeaders = () => {
  return {
    'Content-Type': 'application/json'
  }
}

export class ApiFilesRequest {
  constructor (
    private readonly path: string
  ) {}

  upload = async <T extends UploadFileParams>(file: T): Promise<UploadFileReturn<T>> => {
    let basePath = `${CONFIG.schoolsFilesUrl}`
    const form = new FormData()

    if (!Array.isArray(file)) {
      basePath = `${basePath}/${this.path}/upload-single`
      form.append('file', file)
    } else {
      basePath = `${basePath}/${this.path}/upload-many`
      file.map((f) => form.append('files', f))
    }

    const sp = new URLSearchParams({
      filename: 'KEEP_CLIENT_VERSION'
    }).toString()
    basePath = basePath.concat(`?${sp}`)

    const uploader = async (form: FormData) => await fetchOnce(basePath, {
      method: 'POST',
      body: form
    })

    const res = await uploader(form)
    if (res.status !== 201) throwApiResponseError(res.status)
    return await res.json() as unknown as UploadFileReturn<T>
  }

  getList = async () => {
    const path = `${CONFIG.schoolsFilesUrl}/${this.path}`
    const res = await fetchOnce(path, {
      headers: getHeaders()
    })
    if (res.status !== 200) throwApiResponseError(res.status)
    return await res.json() as FileList
  }

  getFile = async (url: string, name: string) => {
    const res = await fetchOnce(url)
    if (res.status !== 200) throwApiResponseError(res.status)
    return new File([await res.blob()], name)
  }

  makePreviewUrl = (name: string) => `${CONFIG.schoolsFilesUrl}/${this.path}/${name}?imgwidth=300`
  makeDownloadUrl = (name: string) => `${CONFIG.schoolsFilesUrl}/${this.path}/download/${name}`

  preDownloadAsUrl = async (path: string, name: string) => await new Promise<string | undefined>((resolve) => {
    this.getFile(path, name).then((file) => {
      resolve(URL.createObjectURL(file))
    }).catch(() => {
      resolve(undefined)
    })
  })

  getPreviewUrl = async (name: string) => {
    const path = this.makePreviewUrl(name)
    return await this.preDownloadAsUrl(path, name)
  }

  getDownloadUrl = async (name: string) => {
    const path = this.makeDownloadUrl(name)
    return await this.preDownloadAsUrl(path, name)
  }

  delete = async (name: string) => {
    const path = `${CONFIG.schoolsFilesUrl}/${this.path}/${name}`
    const res = await fetchOnce(path, {
      headers: getHeaders()
    })
    if (res.status !== 200) throwApiResponseError(res.status)
    return res.ok
  }
}
