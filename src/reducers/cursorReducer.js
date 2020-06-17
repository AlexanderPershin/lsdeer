import { SET_CURSOR } from '../actions/types';

const initialState = 0;

const cursorReducer = function (state = initialState, action) {
  switch (action.type) {
    case SET_CURSOR:
      return action.payload;
    default:
      return state;
  }
};

export default cursorReducer;
