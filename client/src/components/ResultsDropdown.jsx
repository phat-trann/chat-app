import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, List, Divider, ListSubheader } from '@mui/material';
import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

const channelByUser = async ({ client, setActiveChannel, channel, setChannel }) => {
  const filters = {
    type: 'messaging',
    member_count: 2,
    members: { $eq: [client.user.id, client.userID] },
  };

  const [existingChannel] = await client.queryChannels(filters);

  if (existingChannel) return setActiveChannel(existingChannel);

  const newChannel = client.channel('messaging', { members: [channel.id, client.userID] });

  setChannel(newChannel)

  return setActiveChannel(newChannel);
};

const SearchResult = ({ channel, type, setChannel }) => {
  const { client, setActiveChannel } = useChatContext();

  if (type === 'channel') {
    return (
      <ListItem disablePadding>
        <ListItemButton onClick={() => {
          setChannel(channel)
        }}>
          <ListItemIcon>
            #
          </ListItemIcon>
          <ListItemText primary={channel.data.name} />
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={async () => {
        channelByUser({ client, setActiveChannel, channel, setChannel })
      }}>
        <ListItemIcon>
          <Avatar image={channel.image || undefined} size={24} />
        </ListItemIcon>
        <ListItemText primary={channel.name} />
      </ListItemButton>
    </ListItem>
  );
};

const SearchLoading = () => (<ListItem disablePadding>
  <ListItemButton>
    <ListItemIcon>
      <Skeleton variant="circular" width={24} height={24} />
    </ListItemIcon>
    <ListItemText primary={
      <Skeleton variant="text" width="100%" height={24} />
    } />
  </ListItemButton>
</ListItem>);

const NotFound = ({ name }) => (<ListItem disablePadding>
  <ListItemButton>
    <ListItemIcon>
    </ListItemIcon>
    <ListItemText primary={
      <i>{`Not ${name} found`}</i>
    } />
  </ListItemButton>
</ListItem>)

const ResultsDropdown = ({ teamChannels, directChannels, loading, setChannel }) => {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', color: '#000', pt: 2, position: 'absolute', zIndex: 3, top: 'calc(100% - 20px)' }}>
      <List subheader={
        <ListSubheader disableSticky component="div" id="channel-subheader">
          Channels
        </ListSubheader>
      }>
        {loading && !teamChannels.length && (
          <SearchLoading />
        )}
        {!loading && !teamChannels.length ? (
          <NotFound name="channels" />
        ) : (
          teamChannels?.map((channel, i) => (
            <SearchResult
              channel={channel}
              key={i}
              setChannel={setChannel}
              type='channel'
            />
          ))
        )}
      </List>
      <Divider />
      <List subheader={
        <ListSubheader disableSticky component="div" id="message-subheader">
          Users
        </ListSubheader>
      }>
        {loading && !directChannels.length && (
          <SearchLoading />
        )}
        {!loading && !directChannels.length ? (
          <NotFound name="users" />
        ) : (
          directChannels?.map((channel, i) => (
            <SearchResult
              channel={channel}
              key={i}
              setChannel={setChannel}
              type='user'
            />
          ))
        )}
      </List>
    </Box>

  );
};

export default ResultsDropdown;