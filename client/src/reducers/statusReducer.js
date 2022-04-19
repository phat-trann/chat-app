import { STATUS_CREATING, STATUS_EDITING, RESET_STATUS } from '../actions/types';

const initialState = '';

const clientReducer = (state = initialState, action) => {
  switch (action.type) {
    case STATUS_CREATING:
      return STATUS_CREATING;
    case STATUS_EDITING:
      return STATUS_EDITING;
    case RESET_STATUS:
      return initialState;
    default:
      return state;
  }
};

export default clientReducer;
