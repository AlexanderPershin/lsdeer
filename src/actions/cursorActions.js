import { SET_CURSOR } from './types';

export const setCursor = (num) => {
  return {
    type: SET_CURSOR,
    payload: num,
  };
};
