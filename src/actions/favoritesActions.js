import { ADD_TAB_TO_FAVORITES, REMOVE_TAB_FROM_FAVORITES } from './types';

export const addToFav = (tab) => {
  return {
    type: ADD_TAB_TO_FAVORITES,
    payload: tab,
  };
};

export const removeFromFav = (id) => {
  return {
    type: REMOVE_TAB_FROM_FAVORITES,
    payload: id,
  };
};
