import { ADD_SELECTED_FILES, CLEAR_SELECTED_FILES } from './types';

export const addSelectedFiles = (filenamesArr) => {
  return {
    type: ADD_SELECTED_FILES,
    payload: [...new Set(filenamesArr)],
  };
};

export const clearSelectedFiles = () => {
  return {
    type: CLEAR_SELECTED_FILES,
  };
};
