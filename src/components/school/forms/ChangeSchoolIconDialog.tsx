import { Button, IconButton, Tooltip } from '@mui/material';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { ISchool } from '../../../api/models_school';
import { Dialog } from '../../../containers/Dialog';
import DefaultPreview from '../../../assets/signature.png'
import { StorageFileContext } from '../../../context/files/StorageFilesContext';
import { BtnContainer, BtnPropsContainer } from '../../../containers/types';
import { SubDir } from '../../../hooks/files/useStorageFile';
import { CustomError, ErrorType } from '../../../api/handlers/errors';
import { v4 as uuidV4 } from 'uuid'
import { getFileExtension } from '../../../api/services/utils';
import { SchoolContext } from '../../../context/api/schools';

type ChangeIconDialogParams = {
  school?: ISchool | null
} & (BtnContainer | BtnPropsContainer)

export const ChangeIconDialog = ({school, ...btns}: ChangeIconDialogParams) => {
  const useStorage = useContext(StorageFileContext)
  const useSchool = useContext(SchoolContext)
  const [open, setOpen] = useState(false);
  const [icon, setIcon] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [prevIcon, setPrevIcon] = useState<string>(DefaultPreview)
  const storage = useStorage?.newStorage(SubDir.schoolIcons)

  const onUpload = async () => {
    setUploading(true)
    const finalIcon = icon ? new File([icon], `${uuidV4()}.${getFileExtension(icon.name)}`, {
      type: icon.type
    }) : null
    if (finalIcon) {
      if (!storage) throw new CustomError(ErrorType.unknow, 'Storage inssuses')
      await storage.save(finalIcon)
    }
    await useSchool?.update({
      id: school?.id,
      data: {
        ...school,
        icon: finalIcon?.name || 'default'
      }
    })
    setUploading(false)
    setOpen(false)
  }

  const onSelectIcon = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      return setIcon(e.target.files[0])
    }
  }

  useEffect(() => {
    const getData = async () => {
      if (!!icon) {
        return setPrevIcon(URL.createObjectURL(icon))
      }
      if (!school?.icon || school.icon === 'default') return
      const url = await storage?.getPreviewUrl(school.icon)
      if (!url) return
      setPrevIcon(url)
    }
    getData()
  }, [school])

  const UploadBtn = () => <Button disabled={uploading} onClick={onUpload}>
    {uploading ? 'Guardando...' : 'Guardar'}
  </Button>

  return (
    <Dialog
      title='Cambiar logo'
      state={[open, setOpen]}
      {...btns}
      actions={{
        others: UploadBtn()
      }}
    >
      <Tooltip title={'Click en el logo para cambiar'}>
        <IconButton component="label" >
          <input
            hidden
            accept="image/*"
            type="file"
            name="school_icon"
            onChange={onSelectIcon}
          />
          <img alt={icon?.name} height='128' width='auto' src={prevIcon} onError={(e) => {
            e.preventDefault()
            e.currentTarget.onerror = null
            e.currentTarget.src = DefaultPreview
          }}
          />
        </IconButton>
      </Tooltip>
    </Dialog>
  );
}
