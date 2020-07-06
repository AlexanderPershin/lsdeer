import { TOGGLE_NEW_FILE_FOLDER_MODAL } from '../actions/types';

const initialState = false;

const newFileFolderReducer = function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_NEW_FILE_FOLDER_MODAL:
      return !state;
    default:
      return state;
  }
};

export default newFileFolderReducer;
