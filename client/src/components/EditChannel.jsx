import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList, HeaderForChange } from './';
import { useDispatch } from 'react-redux';
import { changeStatus, changeType } from '../actions';
import { RESET_STATUS, STATUS_EDITING } from '../actions/types';
import { IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
  const handleChange = (e) => {
    e.preventDefault();

    setChannelName(e.target.value);
  }

  return (
    <div className="channel-name-input__wrapper">
      <p>Name</p>
      <input value={channelName} onChange={handleChange} placeholder="change-name" />
      <p>Member</p>
    </div>
  )
}

const EditChannel = () => {
  const { channel } = useChatContext();
  const [channelName, setChannelName] = useState(channel?.data?.name);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();
  const updateChannel = async (event) => {
    event.preventDefault();

    const nameChanged = channelName !== channel.data.name;

    if (!(nameChanged && channelName)) return;

    await channel.update({ name: channelName }, { text: `Channel name changed to ${channelName}` });

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
    <div className="edit-channel__container">
      <HeaderForChange handleClose={handleCloseCreate}>
        <IconButton>
          <Edit sx={{ width: '28px', height: '28px' }} />
        </IconButton>
        Edit Channel
      </HeaderForChange>
      <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />
      <UserList setSelectedUsers={setSelectedUsers} currentChannel={channel} isShowExisted={true} />
      <UserList setSelectedUsers={setSelectedUsers} currentChannel={channel} />
      <div className="edit-channel__button-wrapper" onClick={updateChannel}>
        <p>Save changes</p>
      </div>
    </div>
  )
}

export default EditChannel