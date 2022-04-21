import React, { useEffect } from 'react';
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
import './styles/App.scss';

const App = () => {
  const clientResults = useSelector((state) => state.client);
  const status = useSelector((state) => state.status);
  const dispatch = useDispatch();
  const theme = createTheme({
    palette: {
      primary: {
        main: green[800]
      }
    },
  });

  useEffect(() => {
    dispatch(login({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if ((clientResults?.userID &&
        clientResults?.authToken) || (
          !clientResults?.userID &&
          !clientResults?.authToken
        )) dispatch(changeStatus(RESET_STATUS));
    }
  }, [clientResults, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="100vw" disableGutters sx={{ minHeight: '100vh', backgroundColor: '#ededed' }}>
        {(status === STATUS_LOADING) ?
          (<Box sx={{ display: 'flex', minHeight: '100vh', minWidth: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>) :
          (!clientResults?.userID ?
            <Auth client={clientResults?.client} /> :
            (<Chat client={clientResults?.client} theme="team light">
              <Grid maxWidth="lg" container spacing={0} sx={{ margin: 'auto' }}>
                <Grid item xs={6} md={4}>
                  <ChannelListContainer />
                </Grid>
                <Grid item xs={6} md={8}>
                  <ChannelContainer />
                </Grid>
              </Grid>
            </Chat>))}
      </Container>
    </ThemeProvider>
  )
}

export default App