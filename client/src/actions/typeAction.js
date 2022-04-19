import { CHANGE_TYPE } from '../actions/types';

const changeType = (type) => ({
  type: CHANGE_TYPE,
  payload: type
});

export default changeType;
