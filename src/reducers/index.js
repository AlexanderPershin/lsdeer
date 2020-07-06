import { combineReducers } from 'redux';
import tabsReducer from './tabsReducer';
import activeTabReducer from './activeTabReducer';
import selectedFilesReducer from './selectedFilesReducer';
import drivesReducer from './drivesReducer';
import searchReducer from './searchReducer';
import favReducer from './favReducer';
import settingsReducer from './settingsReducer';
import hideInterfaceReducer from './hideInterfaceReducer';
import toggleSettingsReducer from './toggleSettingsReducer';
import loadingReducer from './loadingReducer';
import cursorReducer from './cursorReducer';
import newFileFolderReducer from './newFileFolderReducer';

const reducers = combineReducers({
  tabs: tabsReducer,
  activeTab: activeTabReducer,
  selected: selectedFilesReducer,
  drives: drivesReducer,
  search: searchReducer,
  favorites: favReducer,
  settings: settingsReducer,
  hideInterface: hideInterfaceReducer,
  showSettings: toggleSettingsReducer,
  loading: loadingReducer,
  cursor: cursorReducer,
  createNew: newFileFolderReducer,
});

export default reducers;
