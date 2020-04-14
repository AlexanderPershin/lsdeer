import { SET_ACTIVE } from './types';

export const setActiveTab = (tab) => {
  return {
    type: SET_ACTIVE,
    payload: tab,
  };
};
