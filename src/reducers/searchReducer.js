import { TOGGLE_SEARCH, SET_SEARCH, CLOSE_SEARCH } from '../actions/types';

const initialState = {
  searching: false,
  searchString: '',
};

const searchReducer = function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SEARCH:
      return { ...state, searching: !state.searching };
    case SET_SEARCH:
      return { ...state, searchString: action.payload };
    case CLOSE_SEARCH:
      return { ...state, searching: false };
    default:
      return state;
  }
};

export default searchReducer;
