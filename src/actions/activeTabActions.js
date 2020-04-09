import { SET_ACTIVE } from './types';

export const setActiveTab = (id) => {
  return {
    type: SET_ACTIVE,
    payload: id,
  };
};
