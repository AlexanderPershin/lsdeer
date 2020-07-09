import { TOGGLE_RENAME_MODAL } from '../actions/types';

const initialState = false;

const renameReducer = function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_RENAME_MODAL:
      return !state;
    default:
      return state;
  }
};

export default renameReducer;
