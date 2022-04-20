import React from 'react';
import { Avatar, ChannelList } from 'stream-chat-react';

import { ChannelSearch, TeamChannelList, TeamChannelPreview } from './';

import { IoIosHome, IoIosLogOut } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { changeStatus, logout } from '../actions';
import { STATUS_EDIT_PROFILE } from '../actions/types';

const SideBar = ({ handleLogout, client }) => {
  const dispatch = useDispatch();
  const image = useSelector(state => state.client.newImage);

  return (
    <div className="channel-list__sidebar">
      <div className="channel-list__sidebar__home">
        <div className="icon__inner" >
          {
            client?.user ?
              <Avatar image={image || client.user.image} name={client.user.name} size={44} onClick={() => {
                dispatch(changeStatus(STATUS_EDIT_PROFILE));
              }}/> :
              <IoIosHome />
          }
        </div>
      </div>
      <div className="channel-list__sidebar__logout">
        <div className="icon__inner" onClick={handleLogout}>
          <IoIosLogOut />
        </div>
      </div>
    </div>
  )
}

const CompanyHeader = () => (
  <div className="channel-list__header">
    <p className="channel-list__header__text">
      Chat App
    </p>
  </div>
)

const customChannelTeamFilter = (channels) => {
  return channels.filter(channel => channel.type === 'team');
}

const customChannelMessageFilter = (channels) => {
  return channels.filter(channel => channel.type === 'messaging');
}

const ChannelListContainer = () => {
  const clientResults = useSelector((state) => state.client);
  const dispatch = useDispatch();
  const client = clientResults.client;
  const filter = { members: { $in: [clientResults.userID] } };

  const handleLogout = () => {
    dispatch(logout(client));
  }

  return (
    <>
      <SideBar handleLogout={handleLogout} client={client} />
      <div className="channel-list__list__wrapper">
        <CompanyHeader />
        <ChannelSearch />
        <ChannelList
          filters={filter}
          channelRenderFilterFn={customChannelTeamFilter}
          List={(listProps) => (
            <TeamChannelList
              {...listProps}
              type="team"
            />
          )}
          Preview={(previewProps) => (
            <TeamChannelPreview
              {...previewProps}
              type="team"
            />
          )}
        />
        <ChannelList
          filters={filter}
          channelRenderFilterFn={customChannelMessageFilter}
          List={(listProps) => (
            <TeamChannelList
              {...listProps}
              type="messaging"
            />
          )}
          Preview={(previewProps) => (
            <TeamChannelPreview
              {...previewProps}
              type="messaging"
            />
          )}
        />
      </div>
    </>
  )
}

export default ChannelListContainer