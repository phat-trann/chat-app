import React, { useEffect, useState } from 'react';
import { Chat } from 'stream-chat-react';
import { useDispatch, useSelector } from 'react-redux';

import { ChannelContainer, ChannelListContainer, Auth } from './components';
import { login } from './actions';

import 'stream-chat-react/dist/css/index.css';
import './styles/App.scss';

const App = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const clientResults = useSelector((state) => state.client);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(login({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    !clientResults?.userID ?
      <Auth client={clientResults?.client}/> :
      (<div className="app__wrapper">
        <Chat client={clientResults?.client} theme="team light">
          <ChannelListContainer
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            setIsEditing={setIsEditing}
          />
          <ChannelContainer
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </Chat>
      </div>)
  )
}

export default App