import { TOGGLE_INTERFACE } from '../actions/types';

const initialState = false;

const hideInterfaceReducer = function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_INTERFACE:
      return !state;
    default:
      return state;
  }
};

export default hideInterfaceReducer;
