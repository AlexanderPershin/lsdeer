import { SET_TABS, CLOSE_ALL_TABS, ADD_TAB, CLOSE_TAB } from '../actions/types';

const initialState = [
  {
    id: '1',
    name: 'computer',
    content: ['folder1', 'index.html', 'diary.docx'],
  },
  {
    id: '2',
    name: 'music',
    content: ['folder2', 'index.js', 'story.docx'],
  },
  {
    id: '3',
    name: 'photo',
    content: ['folder3', 'index.py', 'cheatsheet.docx'],
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
