import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { ThemeProvider, ThemeContext } from 'styled-components';
import { nanoid } from 'nanoid';
import {
  addTab,
  closeTab,
  openDir,
  setTabs,
  openDirectory,
} from './actions/tabsActions';
import { setDrives, clearDrives } from './actions/drivesActions';
import { setActiveTab } from './actions/activeTabActions';
import {
  addSelectedFiles,
  clearSelectedFiles,
} from './actions/selectFilesActions';
import { closeSearch, toggleSearch } from './actions/searchActions';
import { addToFav, removeFromFav } from './actions/favoritesActions';
import { setSettings, clearSettings } from './actions/settingsActions';
import GlobalStyle from './themes/globalStyle';
import { initializeFileTypeIcons } from '@uifabric/file-type-icons';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

import Electronbar from 'electronbar';
import 'electronbar/lib/electronbar.css';

import Settings from './components/Settings';

import deerBg from './img/deer.svg';

import defaultTheme from './themes/default';

import Tabs from './components/Tabs/Tabs';
import TabContentContainer from './components/Tabs/TabContentContainer';

import appIcon from './img/Renna.png';

import addTabAndActivate from './helpers/addTabAndActivate';

import parseDrivesData from './helpers/parseDrivesData';

import appConfig from './app_config.json';

const { remote, ipcRenderer } = window.require('electron');
const electron = window.require('electron');
const mainWindow = remote.getCurrentWindow();

initializeIcons();
initializeFileTypeIcons();

// TODO: get rid of default window frame and add actual menuTemplate
// from index main
// add styles using styled components using theme variables

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Settings',
        accelerator: 'CmdOrCtrl+,',
        click() {
          ipcRenderer.send('open-settings');
        },
      },
      {
        label: 'Quit',
        role: 'quit',
        accelerator: 'CmdOrCtrl+Q',
        click() {
          console.log('exit');
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectAll',
        click(e) {
          ipcRenderer.send('select-all');
        },
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        click(e) {
          ipcRenderer.send('copy-files');
        },
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        click(e) {
          ipcRenderer.send('paste-files');
        },
      },
      {
        label: 'Delete',
        accelerator: 'delete',
        click(e) {
          ipcRenderer.send('delete-selected');
        },
      },
      {
        label: 'XDelete',
        accelerator: 'shift+delete',
        click(e) {
          ipcRenderer.send('x-delete-selected');
        },
      },
      {
        label: 'Add to favorites',
        accelerator: 'CmdOrCtrl+B',
        click() {
          console.log('Add file to favorites');

          ipcRenderer.send('add-files-to-favorites');
        },
      },
    ],
  },
  {
    label: 'Tabs',
    submenu: [
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+T',
        click() {
          ipcRenderer.send('new-tab');
        },
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        click() {
          // TODO: add ipc main event and emit it here
          // in App component listen to response and close current tab
          ipcRenderer.send('close-current-tab');
        },
      },
      {
        label: 'Add to favorites',
        accelerator: 'CmdOrCtrl+G',
        click() {
          ipcRenderer.send('add-to-favorites');
        },
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Find',
        accelerator: 'CmdOrCtrl+F',
        click(e) {
          ipcRenderer.send('find');
        },
      },
      {
        label: 'Refresh Page',
        accelerator: 'CmdOrCtrl+R',
        click() {
          mainWindow.reload();
        },
      },
      {
        label: 'Open DevTools',
        accelerator: 'CmdOrCtrl+`',
        click(e) {
          mainWindow.webContents.openDevTools();
        },
      },
    ],
  },
];

if (process.platform === 'darwin') {
  const applicationName = 'Lsdeer';
  template.unshift({
    label: applicationName,
    submenu: [
      {
        label: `About ${applicationName}`,
      },
      {
        label: `Quit ${applicationName}`,
        role: 'quit',
      },
    ],
  });
}

const StyledApp = styled.div`
  background-image: url(${({ theme }) => theme.bg.appBgImage});
  background-size: cover;
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
`;

const StyledElectronBar = styled.div`
  .electronbar {
    background-color: ${({ theme }) => theme.bg.appBarBg};
    font-size: ${({ theme }) => theme.font.appBarFontSize};
  }
  .electronbar-favicon {
    background-color: transparent;
  }
  .electronbar::before {
    content: '';
    -webkit-app-region: no-drag;
    position: absolute;
    top: 0;
    width: 100%;
    height: 20%;
  }
  .electronbar-title {
    color: ${({ theme }) => theme.colors.appTitleColor};
    text-align: center;
  }
  .electronbar-top-menu-item {
    color: ${({ theme }) => theme.colors.appColor};
  }
  .electronbar-menu-item {
    color: ${({ theme }) => theme.colors.appColor};
  }
  .electronbar-top-menu-item-children {
    padding: 0;
    background-color: ${({ theme }) => theme.bg.contextMenuBg};
  }
  .electronbar-top-menu-item-children,
  .electronbar-menu-item-children {
    box-shadow: ${({ theme }) =>
      `${theme.shadows.menuShadowOffsetX}px ${theme.shadows.menuShadowOffsetY}px ${theme.shadows.menuShadowBlur}px ${theme.shadows.menuShadowSpread}px ${theme.shadows.menuShadowColor}`} !important;
  }
  .electronbar-menu-item-label {
    padding: 0 15px;
  }
  .electronbar-menu-item-label-text {
    font-size: ${({ theme }) => theme.font.appBarMenuFontSize};
  }
  .electronbar-menu-item-label-accelerator {
    font-size: ${({ theme }) => theme.font.appBarMenuFontSize};
  }
  .electronbar-top-menu-item.open,
  .electronbar-menu-item.open {
    background-color: ${({ theme }) => theme.bg.appBarActiveItemBg};
  }
  .electronbar-top-menu-item:not(.disabled):hover,
  .electronbar-menu-item:not(.disabled):hover {
    background-color: ${({ theme }) => theme.bg.selectedBg};
  }
  .electronbar-button {
    font-size: 0.7rem;
  }
  .electronbar-icon-minimize,
  .electronbar-icon-maximize,
  .electronbar-icon-unfullscreen,
  .electronbar-icon-close {
    font-size: 0.5rem;
  }
  .electronbar-button-minimize,
  .electronbar-button-maximize,
  .electronbar-button-unfullscreen,
  .electronbar-button-close {
    padding: 0 1.1rem;
  }
  .electronbar-button-minimize:hover,
  .electronbar-button-maximize:hover,
  .electronbar-button-unfullscreen:hover {
    background-color: ${({ theme }) => theme.bg.activeTabBg};
  }
  .electronbar-button-close:hover {
    background-color: ${({ theme }) => theme.bg.appBarXBtnHover};
  }
`;

function App() {
  const tabs = useSelector((state) => state.tabs);
  const activeTab = useSelector((state) => state.activeTab);
  const selectedStore = useSelector((state) => state.selected);
  const drives = useSelector((state) => state.drives);
  const favorites = useSelector((state) => state.favorites);
  const settings = useSelector((state) => state.settings);
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
    });
  }, []);

  useEffect(() => {
    const tabPath = activeTabObect ? activeTabObect.path : null;

    ipcRenderer.on('copy-to-clipboard', (event) => {
      ipcRenderer.send('copied-file', tabPath, selectedStore);
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
      const { tabId, dirPath } = data;
      const refreshTab = tabs.find((item) => item.id === tabId);
      const refreshTabPath = refreshTab && refreshTab.path;
      if (!refreshTabPath) return;

      ipcRenderer.send('open-directory', tabId, refreshTabPath);
    });

    ipcRenderer.on('previous-tabs', (event, data) => {
      // Reopen each tab because content could change after last closing lsdeer
      dispatch(setTabs(data.tabs));
      data.tabs.map((item) => {
        ipcRenderer.send('start-watching-dir', item.path, item.id);
        ipcRenderer.send('open-directory', item.id, item.path);
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

    return () => {
      ipcRenderer.removeAllListeners();
    };
  }, [
    activeTab,
    activeTabObect,
    dispatch,
    drives,
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

  // Saving/Fetching tabs from tabs.json file from the root folder
  // TODO: Tabs are lost after page refresh fix this bug
  useEffect(() => {
    window.addEventListener('beforeunload', (ev) => {
      // Something is wrong - listeners stack like if they weren't removed
      ipcRenderer.send('save-tabs', tabs);
      ipcRenderer.send('save-favs', favorites);
    });

    window.addEventListener('load', (ev) => {
      ipcRenderer.send('get-tabs');
      ipcRenderer.send('get-favorites');
      ipcRenderer.send('get-settings');
    });

    const MINUTES = appConfig.SAVE_TABS_DELAY || 5; // save tabs every 5 minutes
    const intervDelay = MINUTES * 60 * 1000;

    const saveInterval = setInterval(() => {
      ipcRenderer.send('save-tabs', tabs);
      ipcRenderer.send('save-favs', favorites);
    }, intervDelay);

    return () => {
      window.removeEventListener('beforeunload', (ev) => {
        ipcRenderer.send('save-tabs', tabs);
        ipcRenderer.send('save-favs', favorites);
      });

      window.removeEventListener('load', (ev) => {
        ipcRenderer.send('get-tabs');
        ipcRenderer.send('get-favorites');
      });

      clearInterval(saveInterval);
    };
  }, [favorites, tabs]);

  useEffect(() => {
    dispatch(setSettings(defaultTheme));
  }, []);

  const handleCloseTab = (id) => {
    dispatch(closeTab(id));
  };

  return (
    <ThemeProvider theme={currentTheme || defaultTheme}>
      <StyledElectronBar>
        <div ref={electronbarMount} />
      </StyledElectronBar>
      <GlobalStyle />

      {settingsOpened ? (
        <Settings onClose={() => setSetSettingsOpened(false)} />
      ) : null}

      <StyledApp className='app'>
        <Tabs list={tabs} addNewTab={addNewTab} closeTab={handleCloseTab} />
        <TabContentContainer />
      </StyledApp>
    </ThemeProvider>
  );
}

export default App;
