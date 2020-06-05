import { combineReducers } from 'redux';
import tabsReducer from './tabsReducer';
import activeTabReducer from './activeTabReducer';
import selectedFilesReducer from './selectedFilesReducer';
import drivesReducer from './drivesReducer';
import searchReducer from './searchReducer';
import favReducer from './favReducer';
import settingsReducer from './settingsReducer';
import hideInterfaceReducer from './hideInterfaceReducer';

const reducers = combineReducers({
  tabs: tabsReducer,
  activeTab: activeTabReducer,
  selected: selectedFilesReducer,
  drives: drivesReducer,
  search: searchReducer,
  favorites: favReducer,
  settings: settingsReducer,
  hideInterface: hideInterfaceReducer,
});

export default reducers;
