import { SET_ACTIVE } from '../actions/types';

const initialState = '';

const activeTabsReducer = function (state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVE:
      return action.payload;
    default:
      return state;
  }
};

export default activeTabsReducer;
