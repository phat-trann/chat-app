import React from 'react';
import { Avatar, ChannelList } from 'stream-chat-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Box, Container, Grid } from '@mui/material';

import { ChannelSearch, TeamChannelList, TeamChannelPreview } from './';

import { changeStatus } from '../actions';
import { STATUS_EDIT_PROFILE } from '../actions/types';

const customChannelTeamFilter = (channels) => {
  return channels.filter(channel => channel.type === 'team');
}

const customChannelMessageFilter = (channels) => {
  return channels.filter(channel => channel.type === 'messaging');
}

const customStyle = {
  width: '100%',
  bgcolor: 'background.paper',
  borderRadius: '25px',
  '& .str-chat-channel-list': {
    float: 'none',
    mt: 2,
    mb: 1,
    borderRadius: '50px'
  }
}

const ChannelListContainer = () => {
  const clientResults = useSelector((state) => state.client);
  const image = useSelector(state => state.client.newImage);
  const dispatch = useDispatch();
  const client = clientResults.client;
  const filter = { members: { $in: [clientResults.userID] } };

  return (
    <Container sx={{
      height: '100vh',
      pt: 6.5,
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    }}>
      <Box sx={{ width: '100%' }}>
        <AppBar position="fixed" sx={{ background: 'none', boxShadow: 'none', pointerEvents: 'none' }}>
          <Grid maxWidth="lg" container spacing={0} sx={{ margin: 'auto' }}>
            <Grid item xs={12} md={4}>
              <Container sx={{ pt: 1.5, pb: 1, background: '#ededed' }}>
                <Grid container sx={{ alignItems: 'center', pl: 0, pointerEvents: 'all' }}>
                  <Grid item xs={2} sx={{ '& div': { cursor: 'pointer' } }}>
                    <Avatar image={image || client.user.image} size={44} onClick={() => {
                      dispatch(changeStatus(STATUS_EDIT_PROFILE));
                    }} />
                  </Grid>
                  <Grid item xs={10}>
                    <ChannelSearch />
                  </Grid>
                </Grid>
              </Container>
            </Grid>
            <Grid item xs={0} md={8}>
            </Grid>
          </Grid>
        </AppBar>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={customStyle}>
          <ChannelList
            filters={filter}
            channelRenderFilterFn={customChannelTeamFilter}
            List={(listProps) => (
              <TeamChannelList
                {...listProps}
                type="team"
              />
            )}
            Preview={(previewProps) => (
              <TeamChannelPreview
                {...previewProps}
                type="team"
              />
            )}
          />
        </Box>
        <Box sx={customStyle}>
          <ChannelList
            filters={filter}
            channelRenderFilterFn={customChannelMessageFilter}
            List={(listProps) => (
              <TeamChannelList
                {...listProps}
                type="messaging"
              />
            )}
            Preview={(previewProps) => (
              <TeamChannelPreview
                {...previewProps}
                type="messaging"
              />
            )}
          />
        </Box>
      </Box>
    </Container>
  )
}

export default ChannelListContainer