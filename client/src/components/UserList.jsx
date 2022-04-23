import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import {
  Divider,
  ListSubheader,
  List,
  ListItem,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton
} from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

const ListContainer = ({ children, isShowExisted }) => {
  return (
    <List
      subheader={
        <ListSubheader disableSticky component="div" sx={{ pl: 0, pr: 0 }}>
          {isShowExisted ? 'Current User(s)' : 'Available User(s)'}
          <Divider />
        </ListSubheader>
      }
      sx={{ padding: 0, pt: 1, pb: 1 }}>
      {children}
    </List>
  );
};

const UserItem = ({ user, setSelectedUsers, isShowExisted }) => {
  const [invited, setInvited] = useState(false);

  const handleInvited = () => {
    if (invited) {
      setSelectedUsers((pre) => pre.filter((id) => id !== user.id));
    } else {
      setSelectedUsers((pre) => [...pre, user.id]);
    }

    setInvited((pre) => !pre);
  };

  return (
    <ListItem
      disablePadding
      onClick={isShowExisted ? () => {} : handleInvited}
      secondaryAction={
        isShowExisted ? (
          ''
        ) : invited ? (
          <IconButton edge="end" aria-label="delete">
            <CheckBox />
          </IconButton>
        ) : (
          <IconButton edge="end" aria-label="delete">
            <CheckBoxOutlineBlank />
          </IconButton>
        )
      }>
      <ListItemButton>
        <ListItemIcon>
          <Avatar image={user.image} name={user.name} size={32} />
        </ListItemIcon>
        <ListItemText primary={user.name} />
      </ListItemButton>
    </ListItem>
  );
};

const Loading = () => (
  <>
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>
          <Skeleton variant="circular" width={32} height={32} />
        </ListItemIcon>
        <ListItemText primary={<Skeleton variant="text" width="100%" height={32} />} />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>
          <Skeleton variant="circular" width={32} height={32} />
        </ListItemIcon>
        <ListItemText primary={<Skeleton variant="text" width="100%" height={32} />} />
      </ListItemButton>
    </ListItem>
  </>
);

const Error = ({ children }) => (
  <ListItem disablePadding>
    <ListItemButton>
      <ListItemIcon></ListItemIcon>
      <ListItemText primary={<i>{children}</i>} />
    </ListItemButton>
  </ListItem>
);

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
          );

          if (response?.members?.length && !isWillUnMount) {
            existedUsers = response.members.map((el) => el.user_id);
          }
        }

        const existedList = [...existedUsers, client.userID];
        const query = isShowExisted ? { $in: existedList } : { $nin: existedList };

        const response = await client.queryUsers(
          { id: query, role: { $ne: 'admin' } },
          { id: 1 },
          { limit: 8 }
        );

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

    return () => (isWillUnMount = true);
  }, []);

  return (
    <ListContainer isShowExisted={isShowExisted}>
      {message ? (
        message === 'Loading' ? (
          <Loading />
        ) : (
          <Error>{message}</Error>
        )
      ) : (
        users?.map((user, i) => {
          return (
            <UserItem
              index={i}
              key={user.id}
              user={user}
              setSelectedUsers={setSelectedUsers}
              isShowExisted={isShowExisted}
            />
          );
        })
      )}
    </ListContainer>
  );
};

export default UserList;
