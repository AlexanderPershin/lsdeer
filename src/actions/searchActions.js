import { TOGGLE_SEARCH, SET_SEARCH } from './types';

export const toggleSearch = () => {
  return {
    type: TOGGLE_SEARCH,
  };
};

export const setSearch = (searchString) => {
  return {
    type: SET_SEARCH,
    payload: searchString,
  };
};
