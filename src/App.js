import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { nanoid } from 'nanoid';
import {
  addTab,
  closeTab,
  setTabs,
  openDirectory,
} from './actions/tabsActions';
import { setDrives } from './actions/drivesActions';
import { setActiveTab } from './actions/activeTabActions';
import {
  addSelectedFiles,
  clearSelectedFiles,
} from './actions/selectFilesActions';
import { closeSearch, toggleSearch } from './actions/searchActions';
import { addToFav } from './actions/favoritesActions';
import { setSettings } from './actions/settingsActions';
import { toggleInterface } from './actions/hideInterfaceActions';
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

import addTabAndActivate from './helpers/addTabAndActivate';

import parseDrivesData from './helpers/parseDrivesData';

import appConfig from './app_config.json';
import openInNewTab from './helpers/openInNewTab';

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
  const hideInterface = useSelector((state) => state.hideInterface);
  const dispatch = useDispatch();

  const currentTheme = { ...defaultTheme, ...settings };

  const [settingsOpened, setSetSettingsOpened] = useState(false);

  const activeTabObect = tabs.filter((item) => item.id === activeTab)[0];

  const electronbarMount = useRef(null);
  let electronbar = useRef(null);

  useEffect(() => {
    if (!activeTab) {
      tabs.length > 0 && dispatch(setActiveTab(tabs[0].id));
    }
  }, [activeTab, dispatch, tabs]);

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
        console.log('cut selected');
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

    ipcRenderer.on('directory-opened', (event, { tabId, newPath, isFile }) => {
      // Component opened directory and have sent event to backend
      // backend sent 'directory-opened' response
      // now list newPath directory and send 'resp-dir' event
      ipcRenderer.send('ls-directory', newPath, tabId);
      // This process blocks app process
      // TODO: make this async or something
      if (!isFile) ipcRenderer.send('start-watching-dir', newPath, tabId);
    });

    ipcRenderer.on('resp-dir', (event, data) => {
      const newContent = data.response;
      const tabId = data.tabId;
      const newPath = data.newPath;

      dispatch(openDirectory(tabId, newPath, newContent));
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

    ipcRenderer.on('new-tab-created', (event) => {
      addTabAndActivate(dispatch);
    });

    ipcRenderer.on('current-tab-closed', (event) => {
      ipcRenderer.send('close-tab', activeTab, tabPath);
      dispatch(closeTab(activeTab));
      dispatch(closeSearch());
      const remainingTabs = tabs.filter((item) => item.id !== activeTab);
      remainingTabs.length > 0 &&
        dispatch(setActiveTab(remainingTabs[remainingTabs.length - 1].id));
    });

    ipcRenderer.on('closed-tab', (event, data) => {
      const { tabId, tabPath } = data;
      ipcRenderer.send('stop-watching-dir', tabPath, tabId);
    });

    ipcRenderer.on('refresh-tab', (event, data) => {
      // Backend watcher sends this event when files changed in one of the opened directories
      const { tabId } = data;
      const refreshTab = tabs.find((item) => item.id === tabId);
      const refreshTabPath = refreshTab && refreshTab.path;
      if (!refreshTabPath) return;

      ipcRenderer.send('open-directory', tabId, refreshTabPath);
    });

    ipcRenderer.on('previous-tabs', (event, data) => {
      // Reopen each tab because content could change after last closing lsdeer
      // dispatch(setTabs(data.tabs));
      data.tabs.map((item) => {
        // ipcRenderer.send('open-directory', item.id, item.path);
        openInNewTab(item.name, item.path, false, dispatch);
        return item;
      });
    });

    ipcRenderer.on('previous-favorites', (event, data) => {
      // Add loaded favs to redux store again
      dispatch(addToFav(data.favorites));
    });

    ipcRenderer.on('previous-settings', (event, data) => {
      // Add loaded favs to redux store again
      dispatch(setSettings(data.settings));
    });

    ipcRenderer.on('added-to-favorites', (event, data) => {
      // TODO: save favorites to json file
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

    ipcRenderer.on('selected-added-to-favs', (event) => {
      if (selectedStore.length > 0) {
        console.log('Add selected to favorites');
        const activePath = tabPath;
        const newFavs = selectedStore.map((item) => {
          const contentObj = activeTabObect.content.find(
            (itm) => itm.name === item
          );

          return {
            id: nanoid(),
            name: item,
            path: `${activePath}${item}`,
            isFile: contentObj.isFile,
            ext: contentObj.ext,
          };
        });

        dispatch(addToFav(newFavs));
      } else {
        return;
      }
    });

    ipcRenderer.on('settings-opened', () => {
      setSetSettingsOpened((prev) => !prev);
    });

    ipcRenderer.on('settings-dropped', () => {
      dispatch(setSettings(defaultTheme));
      ipcRenderer.send('apply-settings-event');
    });

    ipcRenderer.on('apply-settings', () => {
      ipcRenderer.send('save-settings', settings);
    });

    ipcRenderer.on('interface-toggled', () => {
      dispatch(toggleInterface());
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

  // Save/Load tabs
  useEffect(() => {
    window.addEventListener('beforeunload', (ev) => {
      const tabsToSave = tabs.map((item) => ({
        name: item.name,
        id: item.id,
        path: item.path,
      }));
      ipcRenderer.send('save-tabs', tabsToSave);
    });

    window.addEventListener('load', (ev) => {
      ipcRenderer.send('get-tabs');
    });

    const MINUTES = appConfig.SAVE_TABS_DELAY || 5; // save tabs every 5 minutes
    const intervDelay = MINUTES * 60 * 1000;

    const saveInterval = setInterval(() => {
      const tabsToSave = tabs.map((item) => ({ id: item.id, path: item.path }));
      ipcRenderer.send('save-tabs', tabsToSave);
    }, intervDelay);

    return () => {
      window.removeEventListener('beforeunload', (ev) => {
        const tabsToSave = tabs.map((item) => ({
          name: item.name,
          id: item.id,
          path: item.path,
        }));
        ipcRenderer.send('save-tabs', tabsToSave);
      });

      window.removeEventListener('load', (ev) => {
        ipcRenderer.send('get-tabs');
      });

      clearInterval(saveInterval);
    };
  }, [tabs, dispatch]);

  // Save/Load favorites
  useEffect(() => {
    window.addEventListener('beforeunload', (ev) => {
      ipcRenderer.send('save-favs', favorites);
    });

    window.addEventListener('load', (ev) => {
      ipcRenderer.send('get-favorites');
      ipcRenderer.send('get-settings');
    });

    const MINUTES = appConfig.SAVE_TABS_DELAY || 5; // save tabs every 5 minutes
    const intervDelay = MINUTES * 60 * 1000;

    const saveInterval = setInterval(() => {
      ipcRenderer.send('save-favs', favorites);
    }, intervDelay);

    return () => {
      window.removeEventListener('beforeunload', (ev) => {
        ipcRenderer.send('save-favs', favorites);
      });

      window.removeEventListener('load', (ev) => {
        ipcRenderer.send('get-favorites');
      });

      clearInterval(saveInterval);
    };
  }, [favorites]);

  return (
    <ThemeProvider theme={currentTheme || defaultTheme}>
      <AppBar electronbarMount={electronbarMount} />
      <GlobalStyle />

      {settingsOpened ? (
        <Settings onClose={() => setSetSettingsOpened(false)} />
      ) : null}

      <StyledApp className='app' hideInterface={hideInterface}>
        <Tabs list={tabs} addNewTab={addNewTab} closeTab={handleCloseTab} />
        <TabContentContainer />
      </StyledApp>
    </ThemeProvider>
  );
}

export default App;
