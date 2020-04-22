import { combineReducers } from 'redux';
import tabsReducer from './tabsReducer';
import activeTabReducer from './activeTabReducer';
import selectedFilesReducer from './selectedFilesReducer';

const reducers = combineReducers({
  tabs: tabsReducer,
  activeTab: activeTabReducer,
  selected: selectedFilesReducer,
});

export default reducers;
