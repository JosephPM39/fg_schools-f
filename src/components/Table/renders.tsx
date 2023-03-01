import { useEffect, useState } from "react"
import { Button, Link } from "@mui/material"
import { Box } from "@mui/system"
import { GridRenderCellParams, GridRowId } from "@mui/x-data-grid"
import { Dialog, DialogParams } from "../../containers/Dialog"
import { OpenInFull } from "@mui/icons-material"


type Value = {
  value?: GridRenderCellParams['value']
}

interface OnToggleParams {
  expanded: boolean,
  id: GridRowId
}

interface Params {
  limit:number,
  onToggle?: (p: OnToggleParams) => void
}

export const GetExpandableCell = (params:Params) => {
  const { limit, onToggle = () => {} } = params
  const ExpandableCell = (params: GridRenderCellParams) => {
    const {value, id} = params
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
      onToggle({
        expanded,
        id
      })
    }, [expanded])

    return (
      <Box>
        {expanded ? value : value.slice(0, limit)}&nbsp;
        {value.length > limit && (
          <Link
            type="button"
            component="button"
            sx={{ fontSize: 'inherit' }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'ver menos' : 'ver más'}
          </Link>
        )}
      </Box>
    );
  };
  return ExpandableCell
}

export const GetColorCell = () => {
  const ColorCell = ({value}: Value) => {
    return <Box sx={{ background: value, width: '20px', height: '20px' }} />
  }
  return ColorCell
}

export const getDialogCell = (params: Omit<DialogParams, 'state' | 'children'> & { previewLimit?: number}) => {
  const {previewLimit: limit = 0} = params
  const DialogCell = ({value}: Value)  => {
    const [open, setOpen] = useState(false)
    return <>
      <Dialog state={[open, setOpen]} {...params} btnProps={{
        variant: 'text',
        size: 'small',
        sx: { fontSize: 'inherit' },
        startIcon: <OpenInFull/>,
        type: 'button'
      }} >
        {value}
      </Dialog>
      {value.slice(0, limit)}...&nbsp;
    </>
  }
  return DialogCell
}

export const GetButtonCell = ({onClick, label}: {onClick: ({value}: Value) => void, label:string}) => {
  const ButtonCell = ({value}: Value) => {
    return <Button onClick={() => onClick({value})}>{label}</Button>
  }
  return ButtonCell
}
