import { useState } from 'react';
import Button from '@mui/material/Button';
import { Dialog } from '../containers/Dialog';
import { BtnContainer } from '../containers/types'

type Params = {
  onAgree: () => void,
  description: string,
  title: string
} & BtnContainer

export const ConfirmDialog = (params: Params) => {
  const { onAgree, description, title, ...rest } = params
  const [open, setOpen] = useState(false);
  console.log('render')

  return (
    <Dialog
      state={[open, setOpen]}
      title={title}
      description={description}
      actions={{
        others: <Button onClick={onAgree} autoFocus>
          Continuar
        </Button>
      }}
      {...rest}
    />
  );
}
