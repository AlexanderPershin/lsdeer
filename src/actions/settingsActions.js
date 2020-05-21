import { SET_SETTINGS, CLEAR_SETTINGS, CHANGE_SETTING } from './types';

export const setSettings = (settings) => {
  return {
    type: SET_SETTINGS,
    payload: settings,
  };
};

export const clearSettings = () => {
  return {
    type: CLEAR_SETTINGS,
  };
};

export const changeSetting = (setting) => {
  // setting = {bg: {appBg: #fff}}
  return {
    type: CHANGE_SETTING,
    payload: setting,
  };
};
