import React from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
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

const dummyTabs = [
  {
    id: '1',
    name: 'documents',
  },
  {
    id: '2',
    name: 'music',
  },
  {
    id: '3',
    name: 'photo',
  },
];

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <StyledApp className='app'>
        <Tabs list={dummyTabs} />
      </StyledApp>
    </ThemeProvider>
  );
}

export default App;
