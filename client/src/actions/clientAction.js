import Cookies from 'universal-cookie';
import { StreamChat } from 'stream-chat';
import axios from 'axios';

import { SET_APP_LOADING } from './types';

const clientAction = () => {
  return async (dispatch) => {
    const cookies = new Cookies();
    const URL = `${process.env.REACT_APP_HOST}/key`;
    const { data: { apiKey } } = await axios.get(URL);
    const authToken = cookies.get('token');
    const client = await StreamChat.getInstance(apiKey);
  
    if (authToken) {
      await client.connectUser({
        id: cookies.get('userID'),
        name: cookies.get('userName'),
        image: cookies.get('avatarURL'),
        phoneNumber: cookies.get('phoneNumber'),
        hashedPassword: cookies.get('hashedPassword')
      }, authToken);
    }
  
    dispatch({
      type: SET_APP_LOADING,
      payload: client
    });
  }
}

export default clientAction;
