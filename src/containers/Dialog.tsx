import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import Button from '@mui/material/Button';
import DialogMUI from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { BtnContainer, BtnPropsContainer, isBtnContainer, isNoBtnContainer, NoBtnContainer } from './types';

interface DialogParams {
  title: string,
  description?: string
  children?: ReactNode
  state: [boolean, Dispatch<SetStateAction<boolean>>]
  actions?: {
    omitCloseOnClickOut?: boolean,
    omitCancel?: boolean,
    others?: ReactNode
  }
}

type Params = DialogParams & (BtnContainer | BtnPropsContainer | NoBtnContainer)

export const Dialog = (params: Params) => {
  const [open, setOpen] = params.state

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const closeOnClickOut = () => {
    if (params.actions?.omitCloseOnClickOut) return
    handleClose()
  }

  const Btn = () => {
    if (isNoBtnContainer(params)) return
    if (isBtnContainer(params)) {
      const Btn = params.btn
      return <div onClick={handleClickOpen}> {Btn} </div>
    }
    return <Button {...params.btnProps} onClick={handleClickOpen} />
  }

  return (
    <div>
      {Btn()}
      <DialogMUI open={open} onClose={closeOnClickOut}>
        <DialogTitle>{params.title}</DialogTitle>
        <DialogContent>
          {params.description && <DialogContentText>
            {params.description}
          </DialogContentText>}
          {params.children}
        </DialogContent>
        <DialogActions>
          { !params?.actions?.omitCancel && <Button onClick={handleClose}>Cancelar</Button> }
          { params?.actions?.others }
        </DialogActions>
      </DialogMUI>
    </div>
  );
}

