import React from 'react';
import { Avatar, ChannelList } from 'stream-chat-react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, IconButton, Menu, MenuItem } from '@mui/material';

import { ChannelSearch, TeamChannelList, TeamChannelPreview } from './';

import { changeStatus, logout } from '../actions';
import { STATUS_EDIT_PROFILE, STATUS_LOADING } from '../actions/types';

const customChannelTeamFilter = (channels) => {
  return channels.filter(channel => channel.type === 'team');
}

const customChannelMessageFilter = (channels) => {
  return channels.filter(channel => channel.type === 'messaging');
}

const ChannelListContainer = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const clientResults = useSelector((state) => state.client);
  const image = useSelector(state => state.client.newImage);
  const dispatch = useDispatch();
  const client = clientResults.client;
  const filter = { members: { $in: [clientResults.userID] } };

  const handleLogout = () => {
    dispatch(changeStatus(STATUS_LOADING));
    dispatch(logout(client));
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container sx={{ background: 'red', height: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <IconButton
          onClick={handleClick}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{ '& div': { margin: 0 } }}
        >
          <Avatar image={image || client.user.image} size={44} />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.36))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 44,
              height: 44,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 25,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          dispatch(changeStatus(STATUS_EDIT_PROFILE));
        }}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      <ChannelSearch />
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