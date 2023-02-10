import { useContext,useEffect,useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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
    handleClose()
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Seleccione una carpeta para trabajar sin internet"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Para trabajar sin conexión a internet, es necesario que seleccione
            una carpeta para guardar/abrir los archivos del programa.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onAgreeHandle} autoFocus>
            Seleccionar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
