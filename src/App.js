import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { nanoid } from 'nanoid';

import defaultTheme from './themes/default';

import RobotoBlack from './fonts/Roboto-Black.ttf';
import RobotoBlackItalic from './fonts/Roboto-BlackItalic.ttf';
import RobotoBold from './fonts/Roboto-Bold.ttf';
import RobotoBoldItalic from './fonts/Roboto-BoldItalic.ttf';
import RobotoItalic from './fonts/Roboto-Italic.ttf';
import RobotoLight from './fonts/Roboto-Light.ttf';
import RobotoLightItalic from './fonts/Roboto-LightItalic.ttf';
import RobotoMedium from './fonts/Roboto-Medium.ttf';
import RobotoMediumItalic from './fonts/Roboto-MediumItalic.ttf';
import RobotoRegular from './fonts/Roboto-Regular.ttf';
import RobotoThin from './fonts/Roboto-Thin.ttf';
import RobotoThinItalic from './fonts/Roboto-ThinItalic.ttf';

import Tabs from './components/Tabs';

const { remote, ipcRenderer, shell } = window.require('electron');
const mainProcess = remote.require('./index.js');

const GlobalStyle = createGlobalStyle`
  *,*::before,*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    background-color: #fff;
    font-family: ${({ theme }) => theme.font.appFontFamily}
  }
  @font-face {
    font-family: 'Roboto';
    src: local('Roboto-Black'), local('Roboto-BlackItalic), local('Roboto-Bold), local('Roboto-BoldItalic), local('Roboto-Light), local('Roboto-LightItalic), local('Roboto-Medium), local('Roboto-MediumItalic), local('Roboto-Regular), local('Roboto-Thin), local('Roboto-ThinItalic),
    url(${RobotoBlack}) format('ttf'),
    url(${RobotoBlackItalic}) format('ttf'),
    url(${RobotoBold}) format('ttf'),
    url(${RobotoBoldItalic}) format('ttf'),
    url(${RobotoItalic}) format('ttf'),
    url(${RobotoLight}) format('ttf'),
    url(${RobotoLightItalic}) format('ttf'),
    url(${RobotoMedium}) format('ttf'),
    url(${RobotoMediumItalic}) format('ttf'),
    url(${RobotoRegular}) format('ttf'),
    url(${RobotoThin}) format('ttf'),
    url(${RobotoThinItalic}) format('ttf');
    font-weight: 300;
    font-style: normal;
}
`;

const StyledApp = styled.div`
  background-color: ${({ theme }) => theme.bg.appBg};
  color: ${({ theme }) => theme.colors.appColor};
  min-height: 100vh;
  font-weight: normal;
  font-style: normal;
`;

function App() {
  const [tabList, setTabList] = useState([
    {
      id: '1',
      name: 'computer',
    },
    {
      id: '2',
      name: 'music',
    },
    {
      id: '3',
      name: 'photo',
    },
  ]);

  const [active, setActive] = useState('default');

  useEffect(() => {
    tabList.length > 0 && setActive(tabList[0].id);
  }, []);

  useEffect(() => {
    ipcRenderer.on('resp-shelljs', (event, data) => {
      console.log(data);
    });
  }, []);

  const addNewTab = () => {
    const newTab = {
      id: nanoid(),
      name: 'Computer',
    };
    setTabList((prev) => [...prev, newTab]);
    setActive(newTab.id);
  };

  const closeTab = (id) => {
    setTabList((prev) => prev.filter((item) => item.id !== id));
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
        <Tabs
          list={tabList}
          active={active}
          setActive={setActive}
          addNewTab={addNewTab}
          closeTab={closeTab}
        />
        <button onClick={() => lsDir('~')}>ls ~</button>
        <button onClick={() => lsDir('/h/')}>h</button>
        <button onClick={() => lsDir('')}>ls current</button>
        <button onClick={getDisks}>getDisks</button>
      </StyledApp>
    </ThemeProvider>
  );
}

export default App;
