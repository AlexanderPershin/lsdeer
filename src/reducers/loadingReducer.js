import { TOGGLE_LOADING, START_LOADING, STOP_LOADING } from '../actions/types';

const initialState = true;

const searchReducer = function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_LOADING:
      return !state;
    case START_LOADING:
      return true;
    case STOP_LOADING:
      return false;
    default:
      return state;
  }
};

export default searchReducer;
