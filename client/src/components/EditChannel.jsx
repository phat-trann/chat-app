import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList } from './';
import { CloseCreateChannel } from '../assets';
import { useDispatch } from 'react-redux';
import { changeStatus } from '../actions';
import { STATUS_EDITING } from '../actions/types';

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

const EditChannel = () => {
  const { channel } = useChatContext();
  const [channelName, setChannelName] = useState(channel?.data?.name);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();

  const updateChannel = async (event) => {
    event.preventDefault();

    const nameChanged = channelName !== (channel.data.name || channel.data.id);

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

  return (
    <div className="edit-channel__container">
      <div className="edit-channel__header">
        <p>Edit Channel</p>
        <CloseCreateChannel />
      </div>
      <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />
      <UserList setSelectedUsers={setSelectedUsers} currentChannel={channel}/>
      <div className="edit-channel__button-wrapper" onClick={updateChannel}>
        <p>Save changes</p>
      </div>
    </div>
  )
}

export default EditChannel