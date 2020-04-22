import { ADD_SELECTED_FILES, CLEAR_SELECTED_FILES } from '../actions/types';

const initialState = [];

const selectedFilesReducer = function (state = initialState, action) {
  switch (action.type) {
    case ADD_SELECTED_FILES:
      return action.payload;
    case CLEAR_SELECTED_FILES:
      return initialState;
    default:
      return state;
  }
};

export default selectedFilesReducer;
