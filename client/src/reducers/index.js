import { combineReducers } from 'redux';

import clientReducer from './clientReducer';
import typeReducer from './typeReducer';
import statusReducer from './statusReducer';
import menuStatusReducer from './menuStatusReducer';

const rootReducer = combineReducers({
  client: clientReducer,
  type: typeReducer,
  status: statusReducer,
  menuStatus: menuStatusReducer
});

export default rootReducer;
