import { useState } from "react"
import { Button, Link } from "@mui/material"
import { Box } from "@mui/system"
import { GridRenderCellParams } from "@mui/x-data-grid"


type Value = {
  value?: GridRenderCellParams['value']
}

export const GetExpandableCell = ({ limit }:{ limit:number }) => {
  const ExpandableCell = ({ value }: Value) => {
    const [expanded, setExpanded] = useState(false);

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

export const GetButtonCell = ({onClick, label}: {onClick: ({value}: Value) => void, label:string}) => {
  const ButtonCell = ({value}: Value) => {
    return <Button onClick={() => onClick({value})}>{label}</Button>
  }
  return ButtonCell
}
