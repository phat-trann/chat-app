import { Close, Logout } from '@mui/icons-material';
import { AppBar, Container, Grid, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'

const HeaderForChange = ({ children, handleClose, handleLogout = null }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="fixed" sx={{ background: 'none', boxShadow: 'none', pointerEvents: 'none' }}>
        <Grid maxWidth="lg" container spacing={0} sx={{ margin: 'auto' }}>
          <Grid item xs={0} md={4}>
          </Grid>
          <Grid item xs={12} md={8}>
            <Container sx={{ pt: 1.5, pb: 1, background: '#ededed' }}>
              <Grid container sx={{ alignItems: 'center', pl: 0, pointerEvents: 'all' }}>
                {
                  handleLogout ?
                    (<Grid item xs={2} md={1}>
                      <IconButton sx={{ bgcolor: 'background.paper' }} onClick={handleLogout}>
                        <Logout />
                      </IconButton>
                    </Grid>) : ''
                }
                <Grid item xs={handleLogout ? 7 : 9} md={handleLogout ? 8 : 9} sx={{ '& div': { cursor: 'pointer' } }}>
                  <Grid container sx={{ alignItems: 'center', justifyContent: 'center', pl: 0, pointerEvents: 'all' }}>
                    <Grid item xs={10} sx={{ width: '100%', textAlign: 'center' }}>
                      <Box sx={{ borderRadius: '50px', bgcolor: '#fff', color: '#000' }}>
                        {children}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={1}>
                  <IconButton onClick={handleClose} sx={{ bgcolor: 'background.paper' }}>
                    <Close />
                  </IconButton>
                </Grid>
              </Grid>
            </Container>
          </Grid>
        </Grid>
      </AppBar>
    </Box>
  )
}

export default HeaderForChange