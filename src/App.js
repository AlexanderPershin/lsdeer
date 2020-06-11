import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { nanoid } from 'nanoid';
import { addTab, closeTab, openDirectory } from './actions/tabsActions';
import { setDrives } from './actions/drivesActions';
import { setActiveTab } from './actions/activeTabActions';
import {
  addSelectedFiles,
  clearSelectedFiles,
} from './actions/selectFilesActions';
import { toggleSearch } from './actions/searchActions';
import { addToFav } from './actions/favoritesActions';
import { setSettings } from './actions/settingsActions';
import { toggleInterface } from './actions/hideInterfaceActions';
import { toggleSettings } from './actions/toggleSettingsActionis';
import { startLoading, stopLoading } from './actions/loadingActions';

import GlobalStyle from './themes/globalStyle';
import { initializeFileTypeIcons } from '@uifabric/file-type-icons';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

// App menu bar
import Electronbar from 'electronbar';
import template from './appMenuTemplate';
import AppBar from './AppBar';
// App Settings
import Settings from './components/Settings';

import defaultTheme from './themes/default';

import Tabs from './components/Tabs/Tabs';
import TabContentContainer from './components/Tabs/TabContentContainer';

import appIcon from './img/Renna.png';

import parseDrivesData from './helpers/parseDrivesData';

// Hooks
import useTabs from './hooks/useTabs';
import useFavs from './hooks/useFavs';
import useSettings from './hooks/useSettings';

const { remote, ipcRenderer } = window.require('electron');
const electron = window.require('electron');

// Allow access in chrome console for testing
window.remote = remote;
window.electron = electron;

initializeIcons();
initializeFileTypeIcons();

const StyledApp = styled.div`
  background-image: url(${({ theme }) => theme.bg.appBgImage});
  background-size: ${({ theme }) => theme.bg.appBgSize};
  background-repeat: no-repeat;
  background-position: center center;
  color: ${({ theme }) => theme.colors.appColor};
  height: 100vh;
  width: 100vw;
  font-weight: normal;
  font-style: normal;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content 1fr;
  & > * {
    display: ${({ hideInterface }) => hideInterface && 'none'};
  }
`;

function App() {
  const tabs = useSelector((state) => state.tabs);
  const activeTab = useSelector((state) => state.activeTab);
  const selectedStore = useSelector((state) => state.selected);
  const drives = useSelector((state) => state.drives);
  const favorites = useSelector((state) => state.favorites);
  const settings = useSelector((state) => state.settings);
  const showSettings = useSelector((state) => state.showSettings);
  const hideInterface = useSelector((state) => state.hideInterface);
  const dispatch = useDispatch();

  const currentTheme = { ...defaultTheme, ...settings };

  const activeTabObect = tabs.filter((item) => item.id === activeTab)[0];

  const electronbarMount = useRef(null);
  let electronbar = useRef(null);

  useEffect(() => {
    electronbar.current = new Electronbar({
      electron: electron,
      window: electron.remote.getCurrentWindow(),
      menu: electron.remote.Menu.buildFromTemplate(template),
      mountNode: electronbarMount.current,
      title: 'lsdeer',
      icon: appIcon,
    });

    // Rewrite built in chromium shortcuts
    window.addEventListener('keyup', (e) => {
      if (e.which === 67 && e.ctrlKey) {
        // ctrl+c copy to clipboard
        // mainWindow.webContents.send('copy-to-clipboard');

        ipcRenderer.send('copy-files');
      }
      if (e.which === 86 && e.ctrlKey) {
        // ctrl+v paste from clipboard
        ipcRenderer.send('paste-files');
        // mainWindow.webContents.send('paste-from-clipboard');
      }
      if (e.which === 65 && e.ctrlKey) {
        // ctrl+a select all files from current folder
        // chromium default shortcut -> need to override here and in menubar
        ipcRenderer.send('select-all');
      }
      if (e.which === 84 && e.ctrlKey) {
        // ctrl+t = new tab
      }
      if (e.which === 87 && e.ctrlKey) {
        // ctrl+w = close current tab
      }
      if (e.which === 46 && e.shiftKey) {
        // shift+delete = delete permanently
        ipcRenderer.send('x-delete-selected');
      }
      if (e.which === 71 && e.ctrlKey) {
        // ctrl+g
        // add tab to favorites
      }
      if (e.which === 88 && e.ctrlKey) {
        // ctrl+x = cut selected files
        ipcRenderer.send('copy-files', true);
      }
    });
  }, []);

  useEffect(() => {
    const tabPath = activeTabObect ? activeTabObect.path : null;

    ipcRenderer.on('copy-to-clipboard', (event, data) => {
      const { isCut } = data;
      ipcRenderer.send('copied-file', tabPath, selectedStore, isCut);
    });

    ipcRenderer.on('paste-from-clipboard', (event) => {
      ipcRenderer.send('pasted-file', tabPath);
    });

    ipcRenderer.on('selected-deleted', (event) => {
      ipcRenderer.send('remove-directories', tabPath, selectedStore);
      dispatch(clearSelectedFiles());
    });

    ipcRenderer.on('selected-x-deleted', (event) => {
      ipcRenderer.send(
        'remove-directories-permanently',
        tabPath,
        selectedStore
      );
    });

    ipcRenderer.on('edit-action-complete', (event, data) => {
      // Here was refresh - redundunt after setting up watchers
    });

    ipcRenderer.on('find-start', (event) => {
      dispatch(toggleSearch());
    });

    ipcRenderer.once('drives-response', (event, data) => {
      const newDrives = parseDrivesData(data.response);

      // shallow comparison
      if (JSON.stringify(drives) === JSON.stringify(newDrives)) {
        // drives are "equal" -> don't set
        return;
      } else {
        dispatch(setDrives(newDrives));
      }
    });

    // TODO: fix bug, here get / on opening /h/ or /d/ drive, /c/ and /e/ open well
    ipcRenderer.on('directory-opened', (event, { tabId, newPath, isFile }) => {
      if (newPath === 'new-tab-path') {
        return;
      }

      dispatch(startLoading());

      ipcRenderer.send('ls-directory', newPath, tabId);

      const watcherdTab = tabs.find((item) => item.id === tabId);

      if (!isFile && watcherdTab)
        ipcRenderer.send('stop-watching-dir', watcherdTab.path, tabId);
      // if (!isFile) ipcRenderer.send('start-watching-dir', newPath, tabId);
    });
    ipcRenderer.on('resp-dir', (event, data) => {
      const newContent = data.response;
      const tabId = data.tabId;
      const newPath = data.newPath;

      // TODO: bug here: triggers 2 times: first correct path, second path: '/' - incorrect

      dispatch(openDirectory(tabId, newPath, newContent));
      dispatch(stopLoading());
      ipcRenderer.send('start-watching-dir', newPath, tabId);
    });

    ipcRenderer.on('all-files-selected', (event, data) => {
      dispatch(
        addSelectedFiles(activeTabObect.content.map((item) => item.name))
      );
    });

    ipcRenderer.on('revealed-in-explorer', (event) => {
      selectedStore.map((item) => {
        const fullpath = tabPath + item;
        ipcRenderer.send('open-in-expolorer', fullpath);
        return item;
      });
    });

    ipcRenderer.on('refresh-tab', (event, data) => {
      // Backend watcher sends this event when files changed in one of the opened directories
      const { tabId } = data;
      const refreshTab = tabs.find((item) => item.id === tabId);
      const refreshTabPath = refreshTab && refreshTab.path;
      if (!refreshTabPath || refreshTabPath === 'new-tab-path') return;

      ipcRenderer.send('open-directory', tabId, refreshTabPath);
    });

    ipcRenderer.on('interface-toggled', () => {
      dispatch(toggleInterface());
    });

    // Doesn't work inside useFavs hook - fix
    ipcRenderer.on('added-to-favorites', (event, data) => {
      const { tabId } = data;
      let addedTab;
      if (tabId) {
        addedTab = tabs.find((item) => item.id === tabId);
      } else {
        addedTab = tabs.find((item) => item.id === activeTab);
      }

      if (favorites.find((item) => item.path === addedTab.path)) {
        return;
      }

      const favoriteTab = {
        id: nanoid() + 'tab',
        name: addedTab.name + '/',
        path: addedTab.path,
      };

      dispatch(addToFav(favoriteTab));
    });

    return () => {
      ipcRenderer.removeAllListeners();
    };
  }, [
    activeTab,
    activeTabObect,
    dispatch,
    drives,
    favorites,
    selectedStore,
    settings,
    tabs,
  ]);

  const addNewTab = () => {
    const newTab = {
      id: nanoid(),
      name: 'New',
    };
    dispatch(addTab(newTab));
    dispatch(setActiveTab(newTab.id));
  };

  useEffect(() => {
    dispatch(setSettings(defaultTheme));
  }, [dispatch]);

  const handleCloseTab = (id) => {
    dispatch(closeTab(id));
  };

  // Load/Save open tabs to json
  useTabs();
  // Load/Save favorites to json
  useFavs();
  // Load/Save settings to json
  useSettings();

  return (
    <ThemeProvider theme={currentTheme || defaultTheme}>
      <AppBar electronbarMount={electronbarMount} />
      <GlobalStyle />

      {showSettings ? (
        <Settings onClose={() => dispatch(toggleSettings())} />
      ) : null}

      <StyledApp className='app' hideInterface={hideInterface}>
        <Tabs list={tabs} addNewTab={addNewTab} closeTab={handleCloseTab} />
        <TabContentContainer />
      </StyledApp>
    </ThemeProvider>
  );
}

export default App;
