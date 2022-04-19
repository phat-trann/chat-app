import { combineReducers } from 'redux';

import clientReducer from './clientReducer';
import typeReducer from './typeReducer';

const rootReducer = combineReducers({
  client: clientReducer,
  type: typeReducer
});

export default rootReducer;
