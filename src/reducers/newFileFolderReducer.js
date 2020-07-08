import { TOGGLE_NEW_FILE_FOLDER_MODAL } from '../actions/types';

const initialState = true;

const newFileFolderReducer = function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_NEW_FILE_FOLDER_MODAL:
      return !state;
    default:
      return state;
  }
};

export default newFileFolderReducer;
