import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { nanoid } from 'nanoid';
import { addTab, closeTab, openDir } from './actions/tabsActions';
import { setDrives, clearDrives } from './actions/drivesActions';
import { setActiveTab } from './actions/activeTabActions';
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
        label: 'Save File',
        accelerator: 'CmdOrCtrl+S',
        click() {
          console.log('Save command');

          // mainWindow.webContents.send('save-markdown');
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
          // selectAllHandler(e);
          mainWindow.webContents.send('select-all');
        },
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        click(e) {
          mainWindow.webContents.send('copy-to-clipboard');
        },
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        click(e) {
          mainWindow.webContents.send('paste-from-clipboard');
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
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        click() {
          // TODO: add ipc main event and emit it here
          // in App component listen to response and close current tab
          console.log('close current tab');
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
    tabs.length > 0 && dispatch(setActiveTab(tabs[0].id));
  }, []);

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
        mainWindow.webContents.send('copy-to-clipboard');
      }
      if (e.which === 86 && e.ctrlKey) {
        mainWindow.webContents.send('paste-from-clipboard');
      }
      if (e.which === 65 && e.ctrlKey) {
        mainWindow.webContents.send('select-all');
        // ipcRenderer.send('select-all');
      }
      if (e.which === 84 && e.ctrlKey) {
        addTabAndActivate(dispatch);
      }
      if (e.which === 87 && e.ctrlKey) {
        // ctrl+w = close current tab causes infinite loop
        // because added inside useEffect on mount
        // add event and listend to it
        // dispatch(closeTab(activeTab));
      }
    });
  }, []);

  useEffect(() => {
    const tabPath = activeTabObect ? activeTabObect.path : null;

    ipcRenderer.on('copy-to-clipboard', (event, data) => {
      ipcRenderer.send('copied-file', tabPath, selectedStore);
    });

    ipcRenderer.on('paste-from-clipboard', (event, data) => {
      ipcRenderer.send('pasted-file', tabPath);
    });

    ipcRenderer.on('edit-action-complete', (event, data) => {
      dispatch(openDir(activeTab, tabPath));
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
  }, [activeTab, activeTabObect, dispatch, selectedStore]);

  const addNewTab = () => {
    const newTab = {
      id: nanoid(),
      name: 'New',
    };
    dispatch(addTab(newTab));
    dispatch(setActiveTab(newTab.id));
  };

  const closeTab = (id) => {
    dispatch(closeTab(id));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <StyledElectronBar>
        <div ref={electronbarMount} />
      </StyledElectronBar>
      <GlobalStyle />
      <StyledApp className='app'>
        <Tabs list={tabs} addNewTab={addNewTab} closeTab={closeTab} />
        <TabContentContainer />
      </StyledApp>
    </ThemeProvider>
  );
}

export default App;
