import { Box, Container } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Channel, MessageSimple } from 'stream-chat-react';

import { STATUS_CREATING, STATUS_EDIT_PROFILE } from '../actions/types';
import { ChannelInner, CreateChannel, EditChannel, EditProfile } from './';

const ChannelContainer = () => {
  const status = useSelector(state => state.status);

  if (status) {
    return (
      (status === STATUS_EDIT_PROFILE) ?
        <EditProfile /> :
        ((status === STATUS_CREATING) ?
          <CreateChannel /> :
          <EditChannel />)
    )
  }

  const EmptyState = () => (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      height: '100%',
      pl: 5,
      pr: 5,
      pb: 3,
      '& p': {
        margin: 0,
        mb: 1
      }
    }}>
      <Box component="p">This is the begging for your chat history.</Box>
      <Box component="p">Send messages, attachments, links, emojis and more</Box>
    </Box>
  );

  return (
    <Container component="main" sx={{
      height: 'calc(100vh - 96px)',
      mt: 10,
      mb: 2
    }}>
      <Box sx={{
        bgcolor: '#fff',
        borderRadius: '25px',
        height: '100%',
        overflow: 'hidden'
      }}>
        <Box sx={{
          padding: 1,
          '& .str-chat-channel': {
            maxHeight: 'calc(100vh - 122px)'
          },
          '& .str-chat__list::-webkit-scrollbar': {
            display: 'none'
          },
          '& .str-chat__reverse-infinite-scroll': {
            pl: 5,
            pr: 5
          },
          '& .str-chat__message-simple-status path': {
            fill: '#2e7d32'
          },
          '& .str-chat__input-flat .str-chat__textarea>textarea': {
            borderRadius: '50px'
          },
          '& .str-chat__input-flat .str-chat__textarea>textarea:focus': {
            boxShadow: 'none'
          },
          '& .str-chat__message-text-inner.str-chat__message-simple-text-inner': {
            padding: '12px 24px',
            border: 0
          }
        }}>
          <Channel
            EmptyStateIndicator={EmptyState}
            Message={(messageProps, i) => <MessageSimple key={i} {...messageProps} />}>
            <ChannelInner />
          </Channel>
        </Box>
      </Box>
    </Container>
  )
}

export default ChannelContainer