import React, { useEffect, useState } from 'react';
import { Chat } from 'stream-chat-react';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from '@emotion/react';
import { CircularProgress, Container, createTheme, Grid } from '@mui/material';
import { green } from '@mui/material/colors';
import { Box } from '@mui/system';

import { ChannelContainer, ChannelListContainer, Auth } from './components';
import { changeStatus, login } from './actions';
import { RESET_STATUS, STATUS_LOADING } from './actions/types';

import 'stream-chat-react/dist/css/index.css';

const App = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;
  const clientResults = useSelector((state) => state.client);
  const status = useSelector((state) => state.status);
  const showMenu = useSelector((state) => state.menuStatus);
  const dispatch = useDispatch();
  const theme = createTheme({
    palette: {
      primary: {
        main: green[800]
      },
      online: {
        main: green['A400']
      }
    }
  });
  const handleWindowSizeChange = () => setWidth(window.innerWidth);

  useEffect(() => {
    dispatch(login({}));
    window.addEventListener('resize', handleWindowSizeChange);

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (
        (clientResults?.userID && clientResults?.authToken) ||
        (!clientResults?.userID && !clientResults?.authToken)
      )
        dispatch(changeStatus(RESET_STATUS));
    };
  }, [clientResults, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="100vw"
        disableGutters
        sx={{
          minHeight: '100vh',
          backgroundColor: '#ededed',
          '& .str-chat__avatar-fallback': {
            backgroundColor: '#2e7d32'
          }
        }}>
        {status === STATUS_LOADING ? (
          <Box
            sx={{
              display: 'flex',
              minHeight: '100vh',
              minWidth: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <CircularProgress />
          </Box>
        ) : !clientResults?.userID ? (
          <Auth client={clientResults?.client} />
        ) : (
          <Chat client={clientResults?.client} theme="team light">
            <Grid maxWidth="lg" container spacing={0} sx={{ margin: 'auto' }}>
              <Grid item xs={12} md={4} sx={isMobile && !showMenu ? { display: 'none' } : {}}>
                <ChannelListContainer />
              </Grid>
              <Grid item xs={12} md={8} sx={isMobile && showMenu ? { display: 'none' } : {}}>
                <ChannelContainer />
              </Grid>
            </Grid>
          </Chat>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
