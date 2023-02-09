import { CONFIG } from '../../config'
import { UploadSingleFileResponse, UploadManyFileResponse } from './types'
import { fetchOnce, throwApiResponseError } from './utils'

type UploadReturn<T extends File | Array<File>> = T extends File ?
UploadSingleFileResponse : UploadManyFileResponse

type List = Array<{
  name: string,
  urlPreview?: string,
  url: string
}>

export class FileRequest {
  constructor(
    private path: string
  ){}

  upload = async <T extends File | Array<File>>(file: T): Promise<UploadReturn<T>> => {

    const path = `${CONFIG.schoolsFilesUrl}/${this.path}`
    const form = new FormData()

    if (!Array.isArray(file)) {
      path.concat('/upload-single')
      form.append('file', file)
    } else {
      path.concat('/upload-many')
      file.map((f) => form.append('files', f))
    }

    const sp = new URLSearchParams({
      filename: 'KEEP_CLIENT_VERSION'
    }).toString()
    path.concat(`?${sp}`)

    const uploader = async (form: FormData) => await fetchOnce(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: form
    })

    const res = await uploader(form)
    if (res.status !== 201) throwApiResponseError(res.status)
    return await res.json() as unknown as UploadReturn<T>
  }

  getList = async () => {
    const path = `${CONFIG.schoolsFilesUrl}/${this.path}`
    const res = await fetchOnce(path)
    if (res.status !== 200) throwApiResponseError(res.status)
    return await res.json() as List
  }

  getPreviewUrl = (name: string) => `${CONFIG.schoolsFilesUrl}/${this.path}/${name}`
  getDownloadUrl = (name: string) => `${CONFIG.schoolsFilesUrl}/${this.path}/download/${name}`

  delete = async (name: string) => {
    const path = `${CONFIG.schoolsFilesUrl}/${this.path}/${name}`
    const res = await fetchOnce(path)
    if (res.status !== 200) throwApiResponseError(res.status)
    return res.ok
  }

}
