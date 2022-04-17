import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import { ChannelContainer, ChannelListContainer, Auth } from './components';

import 'stream-chat-react/dist/css/index.css';
import './styles/App.scss';

const cookies = new Cookies();
const authToken = cookies.get('token');

const App = () => {
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [client, setClient] = useState();

  useEffect(() => {
    async function fetchData() {
      const URL = `${process.env.REACT_APP_HOST}/key`;
      const { data: { apiKey } } = await axios.get(URL);
      const currentClient = StreamChat.getInstance(apiKey);

      if (authToken) {
        currentClient.connectUser({
          id: cookies.get('userID'),
          name: cookies.get('userName'),
          fullName: cookies.get('fullName'),
          image: cookies.get('avatarURL'),
          phoneNumber: cookies.get('phoneNumber'),
          hashedPassword: cookies.get('hashedPassword')
        }, authToken);
      }

      setClient(currentClient);
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authToken) return <Auth />

  return (
    !client ?
      (<div>Loading</div>) :
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