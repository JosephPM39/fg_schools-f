import { SetStateAction, Dispatch, forwardRef } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { useShow } from '../hooks/useShow'
import { BtnContainer, BtnPropsContainer, isBtnContainer, isNoBtnContainer, NoBtnContainer } from './types'

const Transition = forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export interface ModalParams {
  initOpen?: boolean
  title: string
  children: JSX.Element | JSX.Element[]
  fullScreen?: boolean
  actionsToolbar?: React. ReactNode
  state?: [boolean, Dispatch<SetStateAction<boolean>>]
}

type Params = ModalParams & (BtnPropsContainer | BtnContainer | NoBtnContainer)

export const Modal = (params: Params) => {
  const useShows = useShow(params.initOpen ?? false)
  const [show, setShow] = params.state ?? [useShows.show, useShows.setShow]

  const Btn = () => {
    if (isNoBtnContainer(params)) {
      return <></>
    }
    if (isBtnContainer(params)) {
      const Btn = params.btn
      return <div onClick={() => setShow(true)}> {Btn} </div>
    }
    return <Button {...params.btnProps} onClick={() => setShow(true)} />
  }

  return (
    <>
      <Btn/>
      <Dialog
        fullScreen={params.fullScreen}
        open={show}
        TransitionComponent={Transition}
        fullWidth
        sx={{
          maxWidth: '100vw',
          maxHeight: '100vh'
        }}
      >
        <AppBar sx={{ position: 'sticky', margin: 0, padding: 0 }}>
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
            {params.actionsToolbar}
          </Toolbar>
        </AppBar>
        {params.children}
      </Dialog>
    </>
  )
}
