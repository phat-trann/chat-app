import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { changeType, changeStatus } from '../actions';
import { STATUS_CREATING, RESET_STATUS } from '../actions/types';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

export const AddChannel = ({ type }) => {
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
