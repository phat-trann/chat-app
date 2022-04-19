import React from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { changeStatus, changeType } from '../actions';
import { RESET_STATUS, STATUS_CREATING } from '../actions/types';

const AddChannel = ({ type }) => {
  const dispatch = useDispatch();
  const currentType = useSelector(state => state.type);
  const currentStatus = useSelector(state => state.status);
  const handleClickAddChannel = () => {
    dispatch(changeType(type));
    dispatch(changeStatus(((currentType && currentType !== type) || !currentStatus) ? STATUS_CREATING : RESET_STATUS));
  }

  return (
    <div onClick={handleClickAddChannel}>
      {
        currentType === type && currentStatus === STATUS_CREATING ?
          <AiOutlineMinus /> :
          <AiOutlinePlus />
      }
    </div>
  )
};

const TeamChannelList = ({
  children,
  error = false,
  loading, type,
}) => {
  if (error) {
    return type === 'team' ? (
      <div className="team-channel-list">
        <p className="team-channel-list__message">
          Connection error, please wait a moment and try again.
        </p>
      </div>
    ) : null;
  }

  if (loading) {
    return (
      <div className="team-channel-list">
        <p className="team-channel-list__message loading">
          {type === 'team' ? 'Channels' : 'Messages'} loading...
        </p>
      </div>
    );
  }

  return (
    <div className="team-channel-list">
      <div className="team-channel-list__header">
        <p className="team-channel-list__header__title">
          {type === 'team' ? 'Channels' : 'Direct Messages'}
        </p>
        <AddChannel type={type || ''}
        />
      </div>
      {children}
    </div>
  )
}

export default TeamChannelList