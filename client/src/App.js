import React, { useEffect, useState } from 'react';
import { Chat } from 'stream-chat-react';
import { useDispatch, useSelector } from 'react-redux';

import { ChannelContainer, ChannelListContainer, Auth } from './components';
import { clientAction } from './actions';

import 'stream-chat-react/dist/css/index.css';
import './styles/App.scss';


const App = () => {
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const client = useSelector((state) => state.client);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clientAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    !client?.user?.id ?
      <Auth /> :
      (<div className="app__wrapper">
        <Chat client={client} theme="team light">
          <ChannelListContainer
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            setCreateType={setCreateType}
            setIsEditing={setIsEditing}
          />
          <ChannelContainer
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            createType={createType}
          />
        </Chat>
      </div>)
  )
}

export default App