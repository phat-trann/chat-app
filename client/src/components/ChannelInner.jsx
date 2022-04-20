import React from 'react';
import { useDispatch } from 'react-redux';
import { MessageList, MessageInput, Thread, Window, Avatar, useChannelStateContext, useChatContext } from 'stream-chat-react';
import { changeStatus, changeType } from '../actions';
import { RESET_STATUS, STATUS_EDITING } from '../actions/types';
import { BiInfoCircle } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';

const TeamChannelHeader = () => {
  const { channel, watcher_count } = useChannelStateContext();
  const { client } = useChatContext();
  const dispatch = useDispatch();

  const MessagingHeader = () => {
    const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
    const additionalMembers = members.length - 3;
    const handleClickEdit = () => {
      dispatch(changeType('team'));
      dispatch(changeStatus(STATUS_EDITING));
    }

    if (channel.type === 'messaging') {
      return (
        <div className='team-channel-header__name-wrapper'>
          {members.map(({ user }, i) => (
            <div key={i} className='team-channel-header__name-multi'>
              <Avatar image={user.image} name={user.name} size={32} />
              <p className='team-channel-header__name user'>{user.name}</p>
            </div>
          ))}

          {additionalMembers > 0 && <p className='team-channel-header__name user'>and {additionalMembers} more</p>}
        </div>
      );
    }

    return (
      <div className='team-channel-header__channel-wrapper'>
        <p className='team-channel-header__name'># {channel.data.name}</p>
        <span onClick={handleClickEdit}>
          <BiInfoCircle />
        </span>
      </div>
    );
  };

  const getWatcherText = (watchers) => {
    return `${!watchers ? 'No' : watchers} user(s) online`;
  };

  const handleDeleteChannel = async () => {
    if (window.confirm('Are you sure you want to remove it?')) {
      await channel.delete();
      dispatch(changeStatus(RESET_STATUS));
      dispatch(changeType(''));
    }
  }

  return (
    <div className='team-channel-header__container'>
      <MessagingHeader />
      <div className='team-channel-header__right'>
        <p className='team-channel-header__right-text'>{getWatcherText(watcher_count)}</p>
        <span className='team-channel-remove'>
          <AiOutlineDelete onClick={handleDeleteChannel} />
        </span>
      </div>
    </div>
  );
};

const ChannelInner = () => {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <Window>
        <TeamChannelHeader />
        <MessageList />
        <MessageInput />
      </Window>
      <Thread />
    </div>
  );
};

export default ChannelInner;