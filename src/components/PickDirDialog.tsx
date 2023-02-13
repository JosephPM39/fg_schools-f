import { useContext,useEffect,useState } from 'react';
import Button from '@mui/material/Button';
import { Dialog } from '../containers/Dialog';
import { StorageFileContext } from '../context/files/StorageFilesContext';

export const PickDirDialog = () => {
  const useStorage = useContext(StorageFileContext)
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(useStorage?.needPick ?? false)
    return () => {}
  }, [useStorage?.needPick])

  const onAgreeHandle = () => {
    useStorage?.pickDir()
    setOpen(false)
  }

  const description = 'Para trabajar sin conexión a internet, es necesario que seleccione una carpeta para guardar\/abrir los archivos del programa.'

  return (
    <Dialog
      state={[open, setOpen]}
      title={"Seleccione una carpeta para trabajar sin internet"}
      description={description}
      actions={{
        omitCancel: true,
        omitCloseOnClickOut: true,
        others: <Button onClick={onAgreeHandle} autoFocus>
            Seleccionar
        </Button>
      }}
      noButton
    />
  );
}
