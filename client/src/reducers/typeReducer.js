import { CHANGE_TYPE } from '../actions/types';

const typeReducer = (state = '', action) => {
  switch (action.type) {
    case CHANGE_TYPE:
      return state === action.payload ? '' : action.payload;
    default:
      return state;
  }
};

export default typeReducer;
