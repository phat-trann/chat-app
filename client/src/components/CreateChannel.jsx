import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { UserList, HeaderForChange } from './';
import { useDispatch, useSelector } from 'react-redux';
import { changeStatus, changeType } from '../actions';
import { RESET_STATUS } from '../actions/types';
import { AddCircleOutline } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
  const handleChange = (e) => {
    e.preventDefault();

    setChannelName(e.target.value);
  }

  return (
    <div className="channel-name-input__wrapper">
      <p>Name</p>
      <input value={channelName} onChange={handleChange} placeholder="change-name" />
      <p>Add Member</p>
    </div>
  )
}

const CreateChannel = () => {
  const { client, setActiveChannel } = useChatContext();
  const [channelName, setChannelName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);
  const createType = useSelector(state => state.type);
  const dispatch = useDispatch();
  const createChannel = async (e) => {
    e.preventDefault();

    if ((createType === 'team' && !channelName) || selectedUsers.length < 2) return;

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
    <div className="create-channel__container">
      <HeaderForChange handleClose={handleCloseCreate}>
        <IconButton>
          <AddCircleOutline sx={{ width: '28px', height: '28px' }} />
        </IconButton>
        {createType === 'team' ? 'Create a New Channel' : 'Send a direct Message'}
      </HeaderForChange>
      {createType === 'team' && <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />}
      <UserList setSelectedUsers={setSelectedUsers} />
      <div className="create-channel__button-wrapper" onClick={createChannel}>
        <p>{createType === 'team' ? 'Create channel' : 'Create Message group'}</p>
      </div>
    </div>
  )
}

export default CreateChannel