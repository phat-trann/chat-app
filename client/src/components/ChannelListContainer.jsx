import React from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelSearch, TeamChannelList, TeamChannelPreview } from './';

import { IoIosHome, IoIosLogOut } from 'react-icons/io';

const cookies = new Cookies();

const SideBar = ({ handleLogout }) => (
  <div className="channel-list__sidebar">
    <div className="channel-list__sidebar__home">
      <div className="icon__inner">
        <IoIosHome />
      </div>
    </div>
    <div className="channel-list__sidebar__logout">
      <div className="icon__inner" onClick={handleLogout}>
        <IoIosLogOut />
      </div>
    </div>
  </div>
)

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

const ChannelListContainer = ({
  isCreating,
  setIsEditing,
  setCreateType,
  setIsCreating
}) => {
  const handleLogout = () => {
    cookies.remove('token');
    cookies.remove('userID');
    cookies.remove('userName');
    cookies.remove('fullName');
    cookies.remove('avatarURL');
    cookies.remove('phoneNumber');
    cookies.remove('hashedPassword');

    window.location.reload();
  }

  const { client } = useChatContext();
  const filter = { members: { $in: [client.userID] } };

  return (
    <>
      <SideBar handleLogout={handleLogout} />
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
              isCreating={isCreating}
              setIsEditing={setIsEditing}
              setCreateType={setCreateType}
              setIsCreating={setIsCreating}
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
              isCreating={isCreating}
              setIsEditing={setIsEditing}
              setCreateType={setCreateType}
              setIsCreating={setIsCreating}
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