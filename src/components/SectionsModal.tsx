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
import { IProm } from '../api/models_school';
import { SchoolsCardData } from './types';
import { SectionsTabs } from './SectionsTabs';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Params {
  initOpen: boolean,
  prom: IProm[],
  cardData?: SchoolsCardData
}

export const SectionsModal = (params: Params) => {
  const {show, setShow} = useShow(params.initOpen)

  if (!params.prom) return <></>

  return (
    <div>
      <Button variant="outlined" onClick={() => setShow(true)}>
        Listados
      </Button>
      <Dialog
        fullScreen
        open={show}
        onClose={() => setShow(false)}
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
              {`Escuela: ${params.cardData?.school?.name}`}
            </Typography>
          </Toolbar>
        </AppBar>
        <SectionsTabs proms={params.prom} />
      </Dialog>
    </div>
  );
}
