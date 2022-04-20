import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';

const ListContainer = ({ children, isShowExisted }) => {
  return (
    <div className="user-list__container">
      <div className="user-list__header">
        <p>{isShowExisted ? 'Current User(s)' : 'Available User(s)'}</p>
        <p>{isShowExisted ? '' : 'Invite'}</p>
      </div>
      {children}
    </div>
  )
}

const UserItem = ({ user, setSelectedUsers, isShowExisted }) => {
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
    <div className="user-item__wrapper" onClick={isShowExisted ? () => { } : handleInvited}>
      <div className="user-item__name-wrapper">
        <Avatar image={user.image} name={user.name} size={32} />
        <p className="user-item__name">{user.name}</p>
      </div>
      {
        isShowExisted ? '' :
          (invited ?
            <ImCheckboxChecked /> :
            <ImCheckboxUnchecked />)
      }
    </div>
  )
}

const UserList = ({ setSelectedUsers, currentChannel = null, isShowExisted = false }) => {
  const { client } = useChatContext();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('Loading');

  useEffect(() => {
    let isWillUnMount = false;

    (async () => {
      let existedUsers = [];

      try {
        if (currentChannel) {
          const response = await currentChannel.queryMembers(
            { id: { $ne: client.userID } },
            { id: 1 },
            { limit: 8 }
          )

          if (response?.members?.length && !isWillUnMount) {
            existedUsers = response.members.map(el => el.user_id);
          }
        }

        const existedList = [...existedUsers, client.userID]
        const query = isShowExisted ? { $in: existedList } : { $nin: existedList };

        const response = await client.queryUsers(
          { id: query, role: { $ne: 'admin' } },
          { id: 1 },
          { limit: 8 }
        )

        if (isWillUnMount) return;

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

    return () => isWillUnMount = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListContainer isShowExisted={isShowExisted}>
      {(message) ? (
        <div className="user-list__message">
          {message}
        </div>
      ) : (
        users?.map((user, i) => {
          return <UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers} isShowExisted={isShowExisted} />
        })
      )}
    </ListContainer>
  )
}

export default UserList