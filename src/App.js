import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { nanoid } from 'nanoid';
import {
  addTab,
  closeTab,
  openDir,
  openDirectory,
} from './actions/tabsActions';
import { setDrives, clearDrives } from './actions/drivesActions';
import { setActiveTab } from './actions/activeTabActions';
import { addSelectedFiles } from './actions/selectFilesActions';
import GlobalStyle from './themes/globalStyle';
import { initializeFileTypeIcons } from '@uifabric/file-type-icons';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

import Electronbar from 'electronbar';
import 'electronbar/lib/electronbar.css';

import defaultTheme from './themes/default';

import Tabs from './components/Tabs/Tabs';
import TabContentContainer from './components/Tabs/TabContentContainer';

import appIcon from './img/Renna.png';

import addTabAndActivate from './helpers/addTabAndActivate';

import parseDrivesData from './helpers/parseDrivesData';

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
        label: 'Refresh Page',
        accelerator: 'CmdOrCtrl+R',
        click() {
          mainWindow.reload();
        },
      },
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
          console.log('delete');
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
          console.log('open new tab');
          ipcRenderer.send('new-tab');
        },
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        click() {
          // TODO: add ipc main event and emit it here
          // in App component listen to response and close current tab
          console.log('close current tab');
          ipcRenderer.send('close-current-tab');
        },
      },
    ],
  },
  {
    label: 'View',
    submenu: [
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
  background-color: ${({ theme }) => theme.bg.appBg};
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
  .electronbar::before {
    content: '';
    -webkit-app-region: no-drag;
    position: absolute;
    top: 0;
    width: 100%;
    height: 20%;
  }
  .electronbar-title {
    color: white;
    text-align: center;
  }
  .electronbar-top-menu-item-children {
    padding: 0;
    background-color: ${({ theme }) => theme.bg.activeTabBg};
  }
  .electronbar-top-menu-item-children,
  .electronbar-menu-item-children {
    box-shadow: ${({ theme }) => theme.shadows.menuShadow};
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
  const dispatch = useDispatch();

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
    });
  }, []);

  // Events fire too many times, solve this subscription problem
  // remove useEffect's dependensy array or organize remove listeners handler
  useEffect(() => {
    const tabPath = activeTabObect ? activeTabObect.path : null;

    ipcRenderer.on('copy-to-clipboard', (event) => {
      ipcRenderer.send('copied-file', tabPath, selectedStore);
    });

    ipcRenderer.on('paste-from-clipboard', (event) => {
      ipcRenderer.send('pasted-file', tabPath);
    });

    ipcRenderer.on('edit-action-complete', (event, data) => {
      // const { dirPath } = data;
      // ipcRenderer.send('open-directory', activeTab, dirPath);
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

    ipcRenderer.on('directory-opened', (event, { tabId, newPath }) => {
      // Component opened directory and have sent event to backend
      // backend sent 'directory-opened' response
      // now list newPath directory and send 'resp-dir' event
      ipcRenderer.send('ls-directory', newPath, tabId);
    });

    ipcRenderer.on('resp-dir', (event, data) => {
      const newContent = data.response;
      const tabId = data.tabId;
      const newPath = data.newPath;

      ipcRenderer.send('start-watching-dir', newPath, tabId);

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
      console.log('App -> refreshTabPath', refreshTabPath);

      ipcRenderer.send('open-directory', tabId, refreshTabPath);
    });

    return () => {
      ipcRenderer.removeAllListeners();
    };
  }, [activeTab, activeTabObect, dispatch, drives, selectedStore, tabs]);

  const addNewTab = () => {
    const newTab = {
      id: nanoid(),
      name: 'New',
    };
    dispatch(addTab(newTab));
    dispatch(setActiveTab(newTab.id));
  };

  const handleCloseTab = (id) => {
    dispatch(closeTab(id));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <StyledElectronBar>
        <div ref={electronbarMount} />
      </StyledElectronBar>
      <GlobalStyle />
      <StyledApp className='app'>
        <Tabs list={tabs} addNewTab={addNewTab} closeTab={handleCloseTab} />
        <TabContentContainer />
      </StyledApp>
    </ThemeProvider>
  );
}

export default App;
