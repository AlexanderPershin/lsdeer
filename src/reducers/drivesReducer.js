import { SET_DRIVES, CLEAR_DRIVES } from '../actions/types';

const initialState = [];

const drivesReducer = function (state = initialState, action) {
  switch (action.type) {
    case SET_DRIVES:
      return action.payload;
    case CLEAR_DRIVES:
      return initialState;
    default:
      return state;
  }
};

export default drivesReducer;
