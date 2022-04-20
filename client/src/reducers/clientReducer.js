import { LOGIN, LOGOUT, UPDATE_PROFILE } from '../actions/types';

const initState = {};

const clientReducer = (state = initState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...action.payload
      };
    case LOGOUT:
      return {
        ...state,
        ...action.payload
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export default clientReducer;
