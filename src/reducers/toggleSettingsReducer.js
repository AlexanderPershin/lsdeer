import { TOGGLE_SETTINGS } from '../actions/types';

const initialState = false;

const toggleSettingsReducer = function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SETTINGS:
      return !state;
    default:
      return state;
  }
};

export default toggleSettingsReducer;
