import {
  SET_TABS,
  CLOSE_ALL_TABS,
  ADD_TAB,
  CLOSE_TAB,
  OPEN_DIR,
} from '../actions/types';

const initialState = [
  {
    id: '1',
    name: 'books',
    path: '/books',
    content: ['Read', 'Now', 'diary.docx'],
  },
  {
    id: '2',
    name: 'music',
    path: '/music',
    content: ['favorite', 'symphony_of_destruction.mp3', 'paint_it_black.mp3'],
  },
  {
    id: '3',
    name: 'photo',
    path: '/photo',
    content: ['family_photoes', 'birthday.jpg', 'dog.jpg'],
  },
];

const tabsReducer = function (state = [], action) {
  switch (action.type) {
    case SET_TABS:
      return action.payload;
    case ADD_TAB:
      return [...state, action.payload];
    case CLOSE_TAB:
      return state.filter((item) => item.id !== action.payload);
    case CLOSE_ALL_TABS:
      return [];
    case OPEN_DIR: {
      const { id, newPath, newContent } = action.payload;
      return state.map((tab) => {
        if (tab.id === id) {
          tab.name = newPath;
          tab.path = newPath;
          tab.content = newContent;
          delete tab.createNew;
        }
        return tab;
      });
    }
    default:
      return state;
  }
};

export default tabsReducer;
