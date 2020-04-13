import {
  SET_TABS,
  CLOSE_ALL_TABS,
  ADD_TAB,
  CLOSE_TAB,
  OPEN_DIR,
} from './types';

const { remote, ipcRenderer, shell } = window.require('electron');
const mainProcess = remote.require('./index.js');

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

export const openDir = (id, newPath, newContent) => {
  console.log('openDir -> newContent', newContent);

  return {
    type: OPEN_DIR,
    payload: {
      id,
      newPath,
      newContent,
    },
  };
};
