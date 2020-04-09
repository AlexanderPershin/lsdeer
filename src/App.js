import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { nanoid } from 'nanoid';
import { addTab } from './actions/tabsActions';
import { setActiveTab } from './actions/activeTabActions';
import GlobalStyle from './themes/globalStyle';

import defaultTheme from './themes/default';

import Tabs from './components/Tabs/Tabs';

const { remote, ipcRenderer, shell } = window.require('electron');
const mainProcess = remote.require('./index.js');

const StyledApp = styled.div`
  background-color: ${({ theme }) => theme.bg.appBg};
  color: ${({ theme }) => theme.colors.appColor};
  min-height: 100vh;
  font-weight: normal;
  font-style: normal;
  overflow: hidden;
`;

function App() {
  const tabs = useSelector((state) => state.tabs);
  const activeTab = useSelector((state) => state.activeTab);
  const dispatch = useDispatch();

  useEffect(() => {
    tabs.length > 0 && setActiveTab(tabs[0].id);
  }, []);

  useEffect(() => {
    ipcRenderer.on('resp-shelljs', (event, data) => {
      console.log(data);
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

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <StyledApp className='app'>
        <Tabs list={tabs} addNewTab={addNewTab} closeTab={closeTab} />
        <button onClick={() => lsDir('~')}>ls ~</button>
        <button onClick={() => lsDir('/h/')}>h</button>
        <button onClick={() => lsDir('')}>ls current</button>
        <button onClick={getDisks}>getDisks</button>
      </StyledApp>
    </ThemeProvider>
  );
}

export default App;
