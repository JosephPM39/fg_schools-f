import { useState } from "react"
import { Link } from "@mui/material"
import { Box } from "@mui/system"
import { GridRenderCellParams } from "@mui/x-data-grid"


export const GetExpandableCell = ({ limit }:{ limit:number }) => {
  const ExpandableCell = ({ value }: GridRenderCellParams) => {
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
