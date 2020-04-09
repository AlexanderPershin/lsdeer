import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { nanoid } from 'nanoid';
import { addTab } from './actions/tabsActions';
import { setActiveTab } from './actions/activeTabActions';
import GlobalStyle from './themes/globalStyle';

import defaultTheme from './themes/default';

import Tabs from './components/Tabs/Tabs';
import TabContentContainer from './components/Tabs/TabContentContainer';

const { remote, ipcRenderer, shell } = window.require('electron');
const mainProcess = remote.require('./index.js');

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

  useEffect(() => {
    tabs.length > 0 && dispatch(setActiveTab(tabs[0].id));
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
      <GlobalStyle />
      <StyledApp className='app'>
        <Tabs list={tabs} addNewTab={addNewTab} closeTab={closeTab} />
        <TabContentContainer />
      </StyledApp>
    </ThemeProvider>
  );
}

export default App;
