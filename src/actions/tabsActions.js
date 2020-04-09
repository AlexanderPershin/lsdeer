import { SET_TABS, CLOSE_ALL_TABS, ADD_TAB, CLOSE_TAB } from './types';

export const setTabs = (tabs) => {
  return {
    type: SET_TABS,
    payload: tabs,
  };
};

export const addTab = (tab) => {
  return {
    type: ADD_TAB,
    payload: tab,
  };
};

export const closeTab = (id) => {
  return {
    type: CLOSE_TAB,
    payload: id,
  };
};

export const closeAllTabs = () => {
  return {
    type: CLOSE_ALL_TABS,
  };
};
