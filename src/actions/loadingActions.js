import { TOGGLE_LOADING, START_LOADING, STOP_LOADING } from './types';

export const toggleLoading = () => {
  return {
    type: TOGGLE_LOADING,
  };
};

export const startLoading = () => {
  return {
    type: START_LOADING,
  };
};

export const stopLoading = () => {
  return {
    type: STOP_LOADING,
  };
};
