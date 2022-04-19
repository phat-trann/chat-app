import { combineReducers } from 'redux';

import clientReducer from './clientReducer';
import typeReducer from './typeReducer';
import statusReducer from './statusReducer';

const rootReducer = combineReducers({
  client: clientReducer,
  type: typeReducer,
  status: statusReducer
});

export default rootReducer;
