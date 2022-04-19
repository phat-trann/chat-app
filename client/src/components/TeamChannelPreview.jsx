import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

const TeamChannelPreview = ({ channel, type }) => {
  const { channel: activeChannel, client, setActiveChannel } = useChatContext();
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
      onClick={() => setActiveChannel(channel)}>
      {type === 'team' ? <ChannelPreview /> : <DirectPreview />}
    </div>
  )
}

export default TeamChannelPreview