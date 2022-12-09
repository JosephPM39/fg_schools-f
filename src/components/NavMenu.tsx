import * as React from 'react';
import Button from '@mui/material/Button';
import { Settings as SettingsIcon, Edit as EditIcon, Logout as LogoutIcon } from '@mui/icons-material'
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { PopoverMenu } from '../containers/PopoverMenu'

export const NavMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Opciones
      </Button>
      <PopoverMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <EditIcon/>
          Agregar escuela
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <SettingsIcon/>
          Ajustes
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleClose} disableRipple>
          <LogoutIcon/>
          Cerrar sesión
        </MenuItem>
      </PopoverMenu>
    </div>
  );
}
