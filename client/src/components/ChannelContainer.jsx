import React from 'react';
import { useSelector } from 'react-redux';
import { Channel, MessageTeam } from 'stream-chat-react';

import { STATUS_CREATING } from '../actions/types';
import { ChannelInner, CreateChannel, EditChannel } from './';

const ChannelContainer = () => {
  const status = useSelector(state => state.status);

  if (status) {
    return (
      <div className="channel__container">
        {status === STATUS_CREATING ?
          <CreateChannel /> :
          <EditChannel />}
      </div>
    )
  }

  const EmptyState = () => (
    <div className="channel-empty__container">
      <p className="channel-empty__first">This is the begging for your chat history.</p>
      <p className="channel-empty__second">Send messages, attachments, links, emojis and more</p>
    </div>
  );

  return (
    <div className="channel__container">
      <Channel
        EmptyStateIndicator={EmptyState}
        Message={(messageProps, i) => <MessageTeam key={i} {...messageProps} />}>
        <ChannelInner />
      </Channel>
    </div>
  )
}

export default ChannelContainer