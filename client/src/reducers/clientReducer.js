import { SET_APP_LOADING } from '../actions/types';

const initState = {};

const clientReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_APP_LOADING:
      return action.payload;
    default:
      return state;
  }
};

export default clientReducer;
