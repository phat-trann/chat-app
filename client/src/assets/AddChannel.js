import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { changeType, changeStatus } from '../actions';
import { STATUS_CREATING, RESET_STATUS } from '../actions/types';

export const AddChannel = ({ type }) => {
  const dispatch = useDispatch();
  const currentType = useSelector(state => state.type);
  const handleClickAddChannel = () => {
    dispatch(changeType(type));
    dispatch(changeStatus(currentType ? STATUS_CREATING : RESET_STATUS));
  }

  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onClick={handleClickAddChannel}
    >
      <path
        d='M7 0C3.13438 0 0 3.13438 0 7C0 10.8656 3.13438 14 7 14C10.8656 14 14 10.8656 14 7C14 3.13438 10.8656 0 7 0ZM11 7.5H7.5V11H6.5V7.5H3V6.5H6.5V3H7.5V6.5H11V7.5Z'
        fill='white'
        fillOpacity='0.66'
      />
    </svg>
  )
};
