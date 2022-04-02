import React, { useState, useEffect } from 'react';
import { useChatContext } from 'stream-chat-react';

import { IoIosSearch } from 'react-icons/io';


const ChannelSearch = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const getChannel = async (text) => {
    try {
      // TODO: fetch channels
    } catch (e) {
      setQuery('');
    }
  }

  const changeQuery = (e) => {
    e.preventDefault();

    setLoading(true);
    setQuery(e.target.value);
    getChannel(e.target.value);
  }

  return (
    <div className="channel-search__container">
      <div className="channel-search__input__wrapper">
        <div className="channel-search__input__icon">
          <IoIosSearch />
        </div>
        <input 
          type="text"
          className="channel-search__input__text"
          placeholder="Search"
          value={query}
          onChange={changeQuery}
          />
      </div>
    </div>
  )
}

export default ChannelSearch