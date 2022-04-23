import { SHOW_MENU, HIDE_MENU } from '../actions/types';

const initialState = true;

const menuStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MENU:
      return true;
    case HIDE_MENU:
      return false;
    default:
      return state;
  }
};

export default menuStatusReducer;
