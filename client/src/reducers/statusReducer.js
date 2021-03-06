import {
  STATUS_CREATING,
  STATUS_EDITING,
  RESET_STATUS,
  STATUS_EDIT_PROFILE,
  STATUS_LOADING
} from '../actions/types';

const initialState = '';

const clientReducer = (state = STATUS_LOADING, action) => {
  switch (action.type) {
    case STATUS_CREATING:
      return STATUS_CREATING;
    case STATUS_EDITING:
      return STATUS_EDITING;
    case STATUS_EDIT_PROFILE:
      return STATUS_EDIT_PROFILE;
    case STATUS_LOADING:
      return STATUS_LOADING;
    case RESET_STATUS:
      return initialState;
    default:
      return state;
  }
};

export default clientReducer;
