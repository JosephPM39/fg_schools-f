import { memo, ReactNode, useEffect, useRef, useState } from 'react'
import { Button, Link, Paper, Popover, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { GridRenderCellParams, GridRowId, GridValueGetterParams } from '@mui/x-data-grid'
import { Dialog, DialogParams } from '../../containers/Dialog'
import { OpenInFull } from '@mui/icons-material'
import { IBaseModel } from '../../api/models_school/base.model'

interface Value {
  value?: GridRenderCellParams['value']
}

interface OnToggleParams {
  expanded: boolean
  id: GridRowId
}

interface Params {
  limit: number
  onToggle?: (p: OnToggleParams) => void
}

export const getExpandableCell = (params: Params) => {
  const { limit, onToggle = () => {} } = params
  const ExpandableCell = (params: GridRenderCellParams) => {
    const { value, id } = params
    const [expanded, setExpanded] = useState(false)
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
    )
  }
  return ExpandableCell
}

export const getColorCell = () => {
  const ColorCell = ({ value }: Value) => {
    return <Box sx={{ background: value, width: '20px', height: '20px' }} />
  }
  return ColorCell
}

export const getDialogCell = <T extends IBaseModel>(params: Omit<DialogParams, 'state' | 'children'> & {
  handleChildren?: (p: GridRenderCellParams<any, T>) => {
    dialogContent: ReactNode
    preview: string | ReactNode
  }
}) => {
  const {
    handleChildren = ({ value }: GridRenderCellParams<any, T>) => ({
      dialogContent: <>{value}</>,
      preview: typeof value === 'string' ? `${value.slice(0, 10)}...` : ''
    })
  } = params
  const DialogCell = (cellParams: GridRenderCellParams<any, T>) => {
    const [open, setOpen] = useState(false)
    const data = handleChildren(cellParams)
    return <>
      <Dialog state={[open, setOpen]} {...params} btnProps={{
        variant: 'text',
        size: 'small',
        sx: { fontSize: 'inherit' },
        startIcon: <OpenInFull/>,
        type: 'button',
        children: <>{data.preview}</>
      }} >
        {data.dialogContent}
      </Dialog>
    </>
  }
  return DialogCell
}

export const getButtonCell = ({ onClick, label }: { onClick: ({ value }: Value) => void, label: string }) => {
  const ButtonCell = ({ value }: Value) => {
    return <Button onClick={() => onClick({ value })}>{label}</Button>
  }
  return ButtonCell
}

interface GridCellExpandProps {
  value: string
  width: number
}

const OverflowCell = memo(function GridCellExpand (
  props: GridCellExpandProps
) {
  const { width, value } = props
  const wrapper = useRef<HTMLDivElement | null>(null)
  const cellDiv = useRef(null)
  const cellValue = useRef<Element>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showFullCell, setShowFullCell] = useState(false)
  const [showPopper, setShowPopper] = useState(false)

  function isOverflown (element: Element): boolean {
    return (
      element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
    )
  }

  const handleMouseEnter = () => {
    if (!cellValue.current) return
    const isCurrentlyOverflown = isOverflown(cellValue.current)
    setShowPopper(isCurrentlyOverflown)
    setAnchorEl(cellDiv.current)
    setShowFullCell(true)
  }

  const handleMouseLeave = () => {
    setShowFullCell(false)
  }

  useEffect(() => {
    if (!showFullCell) {
      return undefined
    }

    function handleKeyDown (nativeEvent: KeyboardEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [setShowFullCell, showFullCell])

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex'
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: 'auto',
          width,
          display: 'block',
          position: 'absolute',
          top: 0
        }}
      />
      <Box
        ref={cellValue}
        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {value}
      </Box>
      {showPopper && (
        <Popover
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          sx={{
            pointerEvents: 'none'
          }}
          disableRestoreFocus
          onClose={handleMouseLeave}
          style={{
            width: 'auto', marginLeft: -17
          }}
        >
          { wrapper.current && <Paper
            elevation={1}
            style={{ minHeight: wrapper.current.offsetHeight - 3 }}
          >
            <Typography variant="body2" style={{ padding: 8 }}>
              {value}
            </Typography>
          </Paper> }
        </Popover>
      )}
    </Box>
  )
})

interface OverflowCellParams<T> {
  valueGetter?: (p: GridValueGetterParams<T>) => string
}

export const getOverflowCell = (p: OverflowCellParams<any>) => {
  const {
    valueGetter = (p: GridValueGetterParams<any>) => p.value
  } = p

  const Render = (params: GridRenderCellParams<string>) => {
    const value = valueGetter({ ...params, value: params.value ?? '' })
    return (
      <OverflowCell value={value} width={params.colDef.computedWidth} />
    )
  }
  return Render
}
