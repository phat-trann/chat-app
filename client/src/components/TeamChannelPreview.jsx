import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, useChatContext } from 'stream-chat-react';
import { changeStatus, changeType } from '../actions';
import { RESET_STATUS } from '../actions/types';

const TeamChannelPreview = ({ channel, type }) => {
  const { channel: activeChannel, client, setActiveChannel } = useChatContext();
  const [notification, setNotification] = useState(channel?.state?.unreadCount || 0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!activeChannel) setActiveChannel(channel);

    const addNotification = () => {
      setNotification(channel?.state?.unreadCount);
    };

    channel.on('all', addNotification);
    return () => {
      channel.off('all', addNotification);
    };
  }, [channel, activeChannel, setActiveChannel, notification, client]);

  const handleSelectChannel = () => {
    setActiveChannel(channel);
    dispatch(changeStatus(RESET_STATUS));
    dispatch(changeType(''));
  }

  const ChannelPreview = () => (
    <p className="channel-preview__item">
      # {channel?.data?.name || channel?.data?.id}
    </p>
  )

  const DirectPreview = () => {
    const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);

    return (
      <div className="channel-preview__item single">
        <Avatar
          image={members[0]?.user?.image}
          name={members[0]?.user?.name}
          size={24}
        />
        <p>{`${members[0]?.user?.name || members[0]?.user?.id}${members[1]?.user?.name ? ', ...' : ''}`}</p>
      </div>
    )
  }

  return (
    <div className={`channel-preview__wrapper${(channel?.id === activeChannel?.id) ? '__selected' : ''}`}
      onClick={handleSelectChannel}>
      {type === 'team' ? <ChannelPreview /> : <DirectPreview />}
      <div className='channel-notification'>
        {notification > 0 ? notification : ''}
      </div>
    </div>
  )
}

export default TeamChannelPreview