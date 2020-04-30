import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { nanoid } from 'nanoid';
import { addTab } from './actions/tabsActions';
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

const { remote, ipcRenderer, shell, app } = window.require('electron');
const electron = window.require('electron');
const mainProcess = remote.require('./index.js');
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

function App() {
  const tabs = useSelector((state) => state.tabs);
  const activeTab = useSelector((state) => state.activeTab);
  const dispatch = useDispatch();

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
      }
    });
  }, []);

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

  const lsDir = (path) => {
    ipcRenderer.send('ls-directory', path);
  };

  const getDisks = () => {
    ipcRenderer.send('get-disks');
  };

  const renderTestBtns = () => (
    <React.Fragment>
      <button onClick={() => lsDir('~')}>ls ~</button>
      <button onClick={() => lsDir('/h/')}>h</button>
      <button onClick={() => lsDir('')}>ls current</button>
      <button onClick={getDisks}>getDisks</button>
    </React.Fragment>
  );

  return (
    <ThemeProvider theme={defaultTheme}>
      <div ref={electronbarMount} />
      <GlobalStyle />
      <StyledApp className='app'>
        <Tabs list={tabs} addNewTab={addNewTab} closeTab={closeTab} />
        <TabContentContainer />
      </StyledApp>
    </ThemeProvider>
  );
}

export default App;
