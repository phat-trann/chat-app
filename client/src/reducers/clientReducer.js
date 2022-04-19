import { LOGIN, LOGOUT } from '../actions/types';

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
    default:
      return state;
  }
};

export default clientReducer;
