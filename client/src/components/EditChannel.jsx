import React, { useRef, useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList, HeaderForChange } from './';
import { useDispatch } from 'react-redux';
import { changeStatus, changeType } from '../actions';
import { RESET_STATUS, STATUS_EDITING } from '../actions/types';
import { Box, Button, Container, IconButton, TextField } from '@mui/material';
import { Edit } from '@mui/icons-material';

const ChannelNameInput = ({ channelName = '', errorText, nameRef, setChannelName }) => {
  const handleChange = (e) => {
    e.preventDefault();

    setChannelName(e.target.value);
  }

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        margin="dense"
        required
        fullWidth
        label="Channel name"
        name="name"
        onChange={handleChange}
        value={channelName}
        error={!!errorText}
        helperText={errorText}
        inputRef={nameRef}
      />
    </Box>
  )
}

const EditChannel = () => {
  const { channel } = useChatContext();
  const [channelName, setChannelName] = useState(channel?.data?.name);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [errorText, setErrorText] = useState('');
  const nameRef = useRef();
  const dispatch = useDispatch();
  const updateChannel = async (event) => {
    event.preventDefault();
    setErrorText('');

    if (!channelName) {
      setErrorText('Please input this fields.');
      nameRef.current.focus();
      return;
    }

    const nameChanged = channelName !== channel.data.name;

    if (!nameChanged && !selectedUsers.length) {
      setErrorText('Please change the channel name or user list before submit.');
      nameRef.current.focus();
      return;
    }

    if (nameChanged) {
      await channel.update({ name: channelName }, { text: `Channel name changed to ${channelName}` });
    }

    if (selectedUsers.length) {
      await channel.addMembers(selectedUsers);
    }

    setChannelName('');
    setSelectedUsers([]);
    dispatch(changeStatus(STATUS_EDITING));
  }
  const handleCloseCreate = () => {
    dispatch(changeStatus(RESET_STATUS));
    dispatch(changeType(''));
  }

  return (
    <Container component="main" sx={{
      height: 'calc(100vh - 96px)',
      mt: 10,
      mb: 2
    }}>
      <Box sx={{
        bgcolor: '#fff',
        borderRadius: '25px',
        maxHeight: '100%',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}>
        <Box sx={{
          padding: 6,
        }}>
          <HeaderForChange handleClose={handleCloseCreate}>
            <IconButton>
              <Edit sx={{ width: '28px', height: '28px' }} />
            </IconButton>
            Edit Channel
          </HeaderForChange>
          <ChannelNameInput channelName={channelName} errorText={errorText} nameRef={nameRef} setChannelName={setChannelName} />
          <UserList setSelectedUsers={setSelectedUsers} currentChannel={channel} isShowExisted={true} />
          <UserList setSelectedUsers={setSelectedUsers} currentChannel={channel} />
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 4, mb: 1 }}
            onClick={updateChannel}
          >
            Save changes
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default EditChannel