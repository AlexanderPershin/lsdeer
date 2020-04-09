import { SET_TABS, CLOSE_ALL_TABS, ADD_TAB, CLOSE_TAB } from '../actions/types';

const initialState = [
  {
    id: '1',
    name: 'computer',
  },
  {
    id: '2',
    name: 'music',
  },
  {
    id: '3',
    name: 'photo',
  },
];

const tabsReducer = function (state = initialState, action) {
  switch (action.type) {
    case SET_TABS:
      return action.payload;
    case ADD_TAB:
      return [...state, action.payload];
    case CLOSE_TAB:
      return state.filter((item) => item.id !== action.payload);
    case CLOSE_ALL_TABS:
      return [];
    default:
      return state;
  }
};

export default tabsReducer;
