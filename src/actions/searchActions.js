import { TOGGLE_SEARCH, SET_SEARCH, CLOSE_SEARCH } from './types';

export const toggleSearch = () => {
  return {
    type: TOGGLE_SEARCH,
  };
};

export const closeSearch = () => {
  return {
    type: CLOSE_SEARCH,
  };
};

export const setSearch = (searchString) => {
  return {
    type: SET_SEARCH,
    payload: searchString,
  };
};
