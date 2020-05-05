import { SET_DRIVES, CLEAR_DRIVES } from './types';

export const setDrives = (drivesArr) => {
  return {
    type: SET_DRIVES,
    payload: drivesArr,
  };
};

export const clearDrives = () => {
  return {
    type: CLEAR_DRIVES,
  };
};
