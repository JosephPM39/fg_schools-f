import * as React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { NavMenu } from '../components/NavMenu'

export const NavBar = () => {
  return (
    <AppBar position='sticky' component='nav'>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Escuelas
        </Typography>
        <div>
          <NavMenu/>
        </div>
      </Toolbar>
    </AppBar>
  );
}
