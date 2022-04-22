import React, { useRef, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { UserList, HeaderForChange } from './';
import { useDispatch, useSelector } from 'react-redux';
import { changeStatus, changeType } from '../actions';
import { RESET_STATUS } from '../actions/types';
import { AddCircleOutline } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField } from '@mui/material';

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

const CreateChannel = () => {
  const { client, setActiveChannel } = useChatContext();
  const [channelName, setChannelName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);
  const [errorText, setErrorText] = useState('');
  const nameRef = useRef();
  const createType = useSelector(state => state.type);
  const dispatch = useDispatch();
  const createChannel = async (e) => {
    e.preventDefault();
    setErrorText('');

    if ((createType === 'team' && !channelName)) {
      setErrorText('Please input this fields.');
      nameRef.current.focus();
      return;
    };

    if (selectedUsers.length < 2) {
      if (createType === 'team') {
        setErrorText('Please select user(s) before submit.');
        nameRef.current.focus();
      } else {
        alert('Please select user(s)');
      }

      return;
    };

    try {
      const newChannel = await client.channel(createType, channelName, {
        name: channelName, members: selectedUsers
      });

      await newChannel.watch();

      setChannelName('');
      setSelectedUsers([client.userID || '']);
      setActiveChannel(newChannel);
      dispatch(changeStatus(RESET_STATUS));
      dispatch(changeType(''));
    } catch (error) {
      console.error(error);
    }
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
              <AddCircleOutline sx={{ width: '28px', height: '28px' }} />
            </IconButton>
            {createType === 'team' ? 'Create a New Channel' : 'Send a direct Message'}
          </HeaderForChange>
          {createType === 'team' && <ChannelNameInput channelName={channelName} errorText={errorText} nameRef={nameRef} setChannelName={setChannelName} />}
          <UserList setSelectedUsers={setSelectedUsers} />
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 4, mb: 1 }}
            onClick={createChannel}
          >
            {createType === 'team' ? 'Create channel' : 'Create Message group'}
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default CreateChannel