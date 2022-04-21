import React, { useEffect } from 'react';
import { Chat } from 'stream-chat-react';
import { useDispatch, useSelector } from 'react-redux';

import { ChannelContainer, ChannelListContainer, Auth } from './components';
import { login } from './actions';

import 'stream-chat-react/dist/css/index.css';
import './styles/App.scss';
import { ThemeProvider } from '@emotion/react';
import { Container, createTheme } from '@mui/material';
import { green } from '@mui/material/colors';

const App = () => {
  const clientResults = useSelector((state) => state.client);
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

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="100vw" sx={{ minHeight: '100vh', backgroundColor: '#f5f7fb'}}>
        {!clientResults?.userID ?
          <Auth client={clientResults?.client} /> :
          (<div className="app__wrapper">
            <Chat client={clientResults?.client} theme="team light">
              <ChannelListContainer />
              <ChannelContainer />
            </Chat>
          </div>)}
      </Container>
    </ThemeProvider>
  )
}

export default App