import React from 'react';
import { Avatar, ChannelList } from 'stream-chat-react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid } from '@mui/material';

import { ChannelSearch, TeamChannelList, TeamChannelPreview } from './';

import { changeStatus } from '../actions';
import { STATUS_EDIT_PROFILE } from '../actions/types';

const customChannelTeamFilter = (channels) => {
  return channels.filter(channel => channel.type === 'team');
}

const customChannelMessageFilter = (channels) => {
  return channels.filter(channel => channel.type === 'messaging');
}

const ChannelListContainer = () => {
  const clientResults = useSelector((state) => state.client);
  const image = useSelector(state => state.client.newImage);
  const dispatch = useDispatch();
  const client = clientResults.client;
  const filter = { members: { $in: [clientResults.userID] } };

  return (
    <Container sx={{ background: '#005fff', height: '100vh' }}>
      <Grid container spacing={2} sx={{ padding: 1, alignItems: 'center', pt: 2, pb: 2 }}>
        <Grid item xs={2} sx={{ '& div': { cursor: 'pointer' } }}>
          <Avatar image={image || client.user.image} size={44} onClick={() => {
            dispatch(changeStatus(STATUS_EDIT_PROFILE));
          }} />
        </Grid>
        <Grid item xs={10}>
          <ChannelSearch />
        </Grid>
      </Grid>
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
    </Container>
  )
}

export default ChannelListContainer