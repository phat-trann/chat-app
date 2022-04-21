import { Badge, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, useChatContext } from 'stream-chat-react';
import { Mail } from '@mui/icons-material';

import { RESET_STATUS } from '../actions/types';
import { changeStatus, changeType } from '../actions';

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
    <>
      <ListItemIcon>
        #
      </ListItemIcon>
      <ListItemText primary={channel.data.name} />
    </>
  )

  const DirectPreview = () => {
    const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);

    return (
      <>
        <ListItemIcon>
          <Avatar
            image={members[0]?.user?.image}
            name={members[0]?.user?.name}
            size={24}
          />
        </ListItemIcon>
        <ListItemText primary={`${members[0]?.user?.name || members[0]?.user?.id}${members[1]?.user?.name ? ', ...' : ''}`} />
      </>
    )
  }

  return (
    <ListItem disablePadding onClick={handleSelectChannel} secondaryAction={
      (notification > 0) ?
        (<IconButton edge="end" aria-label="delete">
          <Badge badgeContent={notification} max={9} color="primary">
            <Mail color="action" />
          </Badge>
        </IconButton>) : ''
    }>
      <ListItemButton selected={(channel?.id === activeChannel?.id)}>
        {type === 'team' ? <ChannelPreview /> : <DirectPreview />}
      </ListItemButton>
    </ListItem>
  )
}

export default TeamChannelPreview