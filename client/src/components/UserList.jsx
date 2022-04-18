import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import { InviteIcon } from '../assets';

const ListContainer = ({ children }) => {
  return (
    <div className="user-list__container">
      <div className="user-list__header">
        <p>User</p>
        <p>Invite</p>
      </div>
      {children}
    </div>
  )
}

const UserItem = ({ user, setSelectedUsers }) => {
  const [invited, setInvited] = useState(false);

  const handleInvited = () => {
    if (invited) {
      setSelectedUsers(
        pre => pre.filter(id => id !== user.id)
      )
    } else {
      setSelectedUsers(
        pre => [...pre, user.id]
      );
    }

    setInvited(pre => !pre);
  }

  return (
    <div className="user-item__wrapper" onClick={handleInvited}>
      <div className="user-item__name-wrapper">
        <Avatar image={user.image} name={user.fullName || user.name} size={32} />
        <p className="user-item__name">{user.fullName || user.name}</p>
      </div>
      {
        invited ?
          <InviteIcon /> :
          <div className="user-item__invite-empty" />
      }
    </div>
  )
}

const UserList = ({ setSelectedUsers, currentChannel = null }) => {
  const { client } = useChatContext();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('Loading');

  useEffect(() => {
    (async () => {
      let existedUsers = [];

      try {
        if (currentChannel) {
          const response = await currentChannel.queryMembers(
            { id: { $ne: client.userID } },
            { id: 1 },
            { limit: 8 }
          )
      
          if (response?.members?.length) {
            existedUsers = response.members.map(el => el.user_id);
          }
        }

        const response = await client.queryUsers(
          { id: { $nin: [...existedUsers, client.userID] }, role: { $ne: 'admin' } },
          { id: 1 },
          { limit: 8 }
        )
        if (response?.users.length) {
          setUsers(response.users);
          setMessage(null);
        } else {
          setMessage('No user found');
        }
      } catch (error) {
        setMessage('Error loading, please refresh this page and try again.');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListContainer>
      {(message) ? (
        <div className="user-list__message">
          {message}
        </div>
      ) : (
        users?.map((user, i) => {
          return <UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers} />
        })
      )}
    </ListContainer>
  )
}

export default UserList