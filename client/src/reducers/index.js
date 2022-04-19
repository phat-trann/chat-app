import { combineReducers } from 'redux';

import clientReducer from './clientReducer';

const rootReducer = combineReducers({
  client: clientReducer,
});

export default rootReducer;
