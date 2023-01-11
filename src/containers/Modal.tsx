import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { useShow } from '../hooks/useShow';
import { MenuItem } from '@mui/material';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export type ModalParams = {
  initOpen?: boolean,
  title: string
  children: JSX.Element | JSX.Element[]
  fullScreen?: boolean
}

type Params = ModalParams & (BtnProps | Btn)

export type BtnProps = { btnProps: Omit<Parameters<typeof Button>[0], 'onClick'> }
export type Btn = { btn: NonNullable<React.ReactNode> }

function isBtnCmp(params: Params): params is ModalParams & Btn {
  return !!(params as Btn & ModalParams).btn
}

export const Modal = (params: Params) => {
  const {show, setShow} = useShow(params.initOpen ?? false)

  const Btn = () => {
    if (isBtnCmp(params)) {
      const Btn = params.btn
      return <div onClick={() => setShow(true)}> {Btn} </div>
    }
    return <Button {...params.btnProps} onClick={() => setShow(true)} />
  }

  return (
    <>
      {Btn()}
      <Dialog
        fullScreen={params.fullScreen}
        open={show}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setShow(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {params.title}
            </Typography>
          </Toolbar>
        </AppBar>
        {params.children}
      </Dialog>
    </>
  );
}