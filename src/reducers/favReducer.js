import {
  ADD_TAB_TO_FAVORITES,
  REMOVE_TAB_FROM_FAVORITES,
} from '../actions/types';

const initialState = [];

const activeTabsReducer = function (state = initialState, action) {
  switch (action.type) {
    case ADD_TAB_TO_FAVORITES: {
      if (Array.isArray(action.payload)) {
        const notIntersectedFavs = state.filter(
          (item) => !action.payload.find((i) => i.path === item.path)
        );
        return [...notIntersectedFavs, ...action.payload];
      } else {
        return [...state, action.payload];
      }
    }
    case REMOVE_TAB_FROM_FAVORITES:
      return state.filter((item) => item.id !== action.payload);
    default:
      return state;
  }
};

export default activeTabsReducer;
