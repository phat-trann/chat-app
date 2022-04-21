import Cookies from 'universal-cookie';
import { StreamChat } from 'stream-chat';
import axios from 'axios';

import { LOGIN, LOGOUT, UPDATE_PROFILE } from './types';

const cookies = new Cookies();

const login = ({ token, userID, userName, userPhoneNumber, hashedPassword, client: currentClient }) => {
  return async (dispatch) => {
    let client;

    if (token &&
      userID &&
      userName &&
      userPhoneNumber &&
      hashedPassword &&
      currentClient
    ) {
      cookies.set('token', token);
      cookies.set('userName', userName);
      cookies.set('userID', userID);
      cookies.set('phoneNumber', userPhoneNumber);
      cookies.set('hashedPassword', hashedPassword);
      client = currentClient;
    } else {
      const URL = `${process.env.REACT_APP_HOST}/key`;
      const { data: { apiKey } } = await axios.get(URL);
      client = await StreamChat.getInstance(apiKey);
    }

    const authToken = token || cookies.get('token');

    if (authToken) {
      await client.connectUser({
        id: userID || cookies.get('userID'),
        name: userName || cookies.get('userName'),
        phoneNumber: userPhoneNumber || cookies.get('phoneNumber'),
        hashedPassword: hashedPassword || cookies.get('hashedPassword')
      }, authToken);
    }

    dispatch({
      type: LOGIN,
      payload: {
        client,
        userID: client.userID,
        authToken: authToken
      }
    });
  }
}

const logout = (client) => {
  return async (dispatch) => {
    cookies.remove('token');
    cookies.remove('userID');
    cookies.remove('userName');
    cookies.remove('phoneNumber');
    cookies.remove('hashedPassword');

    await client.disconnectUser();

    dispatch({
      type: LOGOUT,
      payload: {
        userID: null,
        authToken: null
      }
    })
  }
}

const update = (client, newImage) => {
  return ({
    type: UPDATE_PROFILE,
    payload: {
      userID: client.userID,
      newImage
    }
  })
}

export {
  login,
  logout,
  update
};
