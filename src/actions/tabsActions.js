import {
  SET_TABS,
  CLOSE_ALL_TABS,
  ADD_TAB,
  CLOSE_TAB,
  OPEN_DIR,
  TEST_ACTION,
} from './types';

const { remote, ipcRenderer, shell } = window.require('electron');
const mainProcess = remote.require('./index.js');

export const lsDir = (path) => {
  ipcRenderer.send('ls-directory', path);
};

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

export const openDir = (id, newPath) => (dispatch) => {
  ipcRenderer.once('resp-dir', (event, data) => {
    dispatch({
      type: OPEN_DIR,
      payload: {
        id,
        newPath,
        newContent: data.response,
      },
    });
  });

  ipcRenderer.send('ls-directory', newPath);
};

export const testAction = () => (dispatch) => {
  ipcRenderer.on('test-response', (event, data) => {
    dispatch({
      type: TEST_ACTION,
      payload: 'test',
    });
  });

  ipcRenderer.send('test');
};
