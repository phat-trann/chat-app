import React, { useState, useEffect } from 'react';
import { useChatContext } from 'stream-chat-react';

import { ResultsDropdown } from './'
import { Search } from '@mui/icons-material';
import { Box, InputAdornment, TextField } from '@mui/material';


const ChannelSearch = () => {
  const { client, setActiveChannel } = useChatContext();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [teamChannels, setTeamChannels] = useState([])
  const [directChannels, setDirectChannels] = useState([])

  useEffect(() => {
    if (!query) {
      setTeamChannels([]);
      setDirectChannels([]);
    }
  }, [query])

  const getChannel = async (text) => {
    if (!text) return;

    try {
      const channelResponse = client.queryChannels({
        type: 'team',
        name: { $autocomplete: text },
        members: { $in: [client.userID] }
      });
      const userResponse = client.queryUsers({
        id: { $ne: client.userID },
        name: { $autocomplete: text }
      })

      const [channels, { users }] = await Promise.all([channelResponse, userResponse]);

      if (channels.length) setTeamChannels(channels);
      if (users.length) setDirectChannels(users);
      setLoading(false);
    } catch (e) {
      setQuery('');
    }
  }

  const changeQuery = (e) => {
    e.preventDefault();

    setLoading(true);
    setQuery(e.target.value);
    getChannel(e.target.value);
  }

  const setChannel = (channel) => {
    setQuery('');
    setActiveChannel(channel);
  }

  return (
    <Box sx={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <TextField
        variant="standard"
        size="small"
        fullWidth
        placeholder="SEARCH"
        autoFocus
        onChange={changeQuery}
        value={query}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          disableUnderline: true
        }}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: '50px',
          zIndex: '4',
          '& > div': {
            padding: '10px'
          },
          '& input': {
            padding: 0
          }
        }}
      />
      {query && (
        <ResultsDropdown
          teamChannels={teamChannels}
          directChannels={directChannels}
          loading={loading}
          setChannel={setChannel}
          setQuery={setQuery}
        />
      )}
    </Box>
  )
}

export default ChannelSearch