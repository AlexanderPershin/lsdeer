import { SET_SETTINGS, CLEAR_SETTINGS, CHANGE_SETTING } from '../actions/types';

const initialState = {};

const settingsReducer = function (state = initialState, action) {
  switch (action.type) {
    case SET_SETTINGS:
      return action.payload;
    case CLEAR_SETTINGS:
      return initialState;
    case CHANGE_SETTING:
      return {
        ...state,
        [Object.keys(action.payload)[0]]: {
          ...state[Object.keys(action.payload)[0]],
          ...Object.values(action.payload)[0],
        },
      };
    default:
      return state;
  }
};

export default settingsReducer;
