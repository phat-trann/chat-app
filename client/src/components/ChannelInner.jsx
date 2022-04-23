import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  MessageList,
  MessageInput,
  Thread,
  Window,
  Avatar,
  useChannelStateContext,
  useChatContext
} from 'stream-chat-react';
import { changeStatus, changeType } from '../actions';
import { RESET_STATUS, SHOW_MENU, STATUS_EDITING } from '../actions/types';
import { Box } from '@mui/system';
import { AppBar, Container, Grid, IconButton } from '@mui/material';
import { Circle, Delete, Info, ArrowBack } from '@mui/icons-material';
import { AlertDialog } from './';

const TeamChannelHeader = () => {
  const { channel, watcher_count } = useChannelStateContext();
  const { client } = useChatContext();
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;
  const dispatch = useDispatch();

  const MessagingHeader = () => {
    let members = Object.values(channel.state.members).filter(
      ({ user }) => user.id !== client.userID
    );
    const handleClickEdit = () => {
      dispatch(changeType('team'));
      dispatch(changeStatus(STATUS_EDITING));
    };

    if (channel.type === 'messaging' && members.length < 4) {
      members = [...members, ...new Array(4 - members.length)];
    }

    members = members.map((member) => member?.user || null);

    return (
      <Box sx={{ pl: 2 }}>
        <Box sx={{ borderRadius: '50px', bgcolor: '#fff', color: '#000' }}>
          {channel.type === 'messaging' ? (
            <Grid
              container
              sx={{ alignItems: 'center', justifyContent: 'center', pl: 0, pointerEvents: 'all' }}>
              {members.map((user, i) => (
                <Grid item xs={3} key={i}>
                  <Grid container sx={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Grid item xs={12} md={4}>
                      {user && i <= 3 ? (
                        i < 3 ? (
                          <IconButton sx={{ '& .str-chat__avatar': { margin: 0 } }}>
                            <Avatar image={user.image} name={user.name} size={28} />
                          </IconButton>
                        ) : (
                          '...'
                        )
                      ) : (
                        ''
                      )}
                    </Grid>
                    <Grid item xs={0} md={8} display={{ xs: 'none', md: 'block' }}>
                      <Box>{user && i < 3 ? user.name : ''}</Box>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid
              container
              sx={{ alignItems: 'center', justifyContent: 'center', pl: 0, pointerEvents: 'all' }}>
              <Grid item xs={2}>
                <IconButton onClick={handleClickEdit}>
                  <Info sx={{ width: '28px', height: '28px' }} />
                </IconButton>
              </Grid>
              <Grid item xs={10} sx={{ width: '100%', textAlign: 'center' }}>
                # {channel.data.name}
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    );
  };

  const handleDeleteChannel = async () => {
    await channel.delete();
    dispatch(changeStatus(RESET_STATUS));
    dispatch(changeType(''));
    setOpen(false);
    dispatch(changeStatus(SHOW_MENU));
  };

  const handleWindowSizeChange = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar
        position="fixed"
        sx={{ background: 'none', boxShadow: 'none', pointerEvents: 'none' }}>
        <Grid maxWidth="lg" container spacing={0} sx={{ margin: 'auto' }}>
          <Grid item xs={0} md={4}></Grid>
          <Grid item xs={12} md={8}>
            <Container sx={{ pt: 1.5, pb: 1, background: '#ededed' }}>
              <Grid
                container
                spacing={1}
                sx={{ alignItems: 'center', pl: 0, pointerEvents: 'all' }}>
                {isMobile && (
                  <Grid item xs={2}>
                    <IconButton
                      sx={{ bgcolor: 'background.paper' }}
                      onClick={() => dispatch(changeStatus(SHOW_MENU))}>
                      <ArrowBack />
                    </IconButton>
                  </Grid>
                )}
                <Grid item xs={2} md={1}>
                  <IconButton sx={{ bgcolor: 'background.paper' }}>
                    <Circle color={watcher_count > 1 ? 'online' : ''} />
                  </IconButton>
                </Grid>
                <Grid item xs={6} md={8} sx={{ '& div': { cursor: 'pointer' } }}>
                  <MessagingHeader />
                </Grid>
                {!isMobile && <Grid item xs={2}></Grid>}
                <Grid item xs={2} md={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    onClick={() => {
                      setOpen(true);
                    }}
                    sx={{ bgcolor: 'background.paper' }}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </Container>
          </Grid>
        </Grid>
      </AppBar>
      <AlertDialog
        open={open}
        content={'Are you sure you want to remove it?'}
        handleClose={() => setOpen(false)}
        handleAgree={handleDeleteChannel}
      />
    </Box>
  );
};

const ChannelInner = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Window>
        <TeamChannelHeader />
        <MessageList />
        <MessageInput />
      </Window>
      <Thread />
    </Box>
  );
};

export default ChannelInner;
