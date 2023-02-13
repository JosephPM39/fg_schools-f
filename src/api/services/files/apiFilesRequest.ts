import { CONFIG } from '../../../config'
import { FileList, UploadFileParams, UploadFileReturn } from '../types'
import { fetchOnce, throwApiResponseError } from '../utils'

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
  }
}

export class ApiFilesRequest {
  constructor(
    private path: string
  ){}

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

  getPreviewUrl = (name: string) => `${CONFIG.schoolsFilesUrl}/${this.path}/${name}?imgwidth=300`
  getDownloadUrl = (name: string) => `${CONFIG.schoolsFilesUrl}/${this.path}/download/${name}`

  delete = async (name: string) => {
    const path = `${CONFIG.schoolsFilesUrl}/${this.path}/${name}`
    const res = await fetchOnce(path, {
      headers: getHeaders()
    })
    if (res.status !== 200) throwApiResponseError(res.status)
    return res.ok
  }

}
