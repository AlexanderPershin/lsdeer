import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { ThemeContext } from 'styled-components';
import {
  setSettings,
  clearSettings,
  changeSetting,
} from '../actions/settingsActions';

import { Icon } from '@fluentui/react/lib/Icon';

const { ipcRenderer } = window.require('electron');

const StyledSettings = styled.div`
  position: fixed;
  top: 30px;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: ${({ theme }) => theme.bg.appBg};
  color: ${({ theme }) => theme.colors.appColor};
  padding: 5px;
  z-index: 900;
  overflow-y: auto;
  opacity: ${({ settingsOpacity }) => settingsOpacity};
  &::-webkit-scrollbar {
    width: 1rem;
    background-color: ${({ theme }) => theme.bg.activeTabBg};
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.bg.tabBg};
    border-left: 2px solid ${({ theme }) => theme.bg.activeTabBg};
    border-right: 2px solid ${({ theme }) => theme.bg.activeTabBg};
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.bg.scrollbarBg};
  }
`;

const StyledHeading = styled.h1`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-content: center;
  margin: 3rem 0;
  font-size: 3rem;
  font-weight: 100;
  padding: 0 5px;
`;

const StyledNav = styled.div`
  position: fixed;
  top: 30px;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.bg.secondaryBg};
  margin: 0;
  padding: 0 30px;
  z-index: 901;
  box-shadow: ${({ theme }) => theme.shadows.navShadow};
`;

const StyledCloseBtn = styled.button`
  font-size: 1.2rem;
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.appColor};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.bg.appBarXBtnHover};
  }
`;

const StyledRange = styled.input`
  -webkit-appearance: none;
  background-color: transparent;
  position: relative;

  &::before {
    position: absolute;
    content: 'Opacity';
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.appColor};
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 30px;
    width: 15px;
    background-color: ${({ theme }) => theme.colors.appColor};
    cursor: pointer;
    position: relative;
    z-index: 2;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 100%;
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg.appBg};
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }

  &:focus {
    outline: ${({ theme }) =>
      `${theme.sizes.focusOutlineWidth} solid ${theme.bg.selectedBg}`};
  }

  &::-ms-track {
    width: 100%;
    cursor: pointer;

    /* Hides the slider so custom styles can be added */
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
`;

const StyledSettingsList = styled.div`
  padding: 5px;
`;

const StyledSubsettingsList = styled.div`
  padding: 5px;
`;

const Settings = ({ onClose }) => {
  const themeContext = useContext(ThemeContext);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const [settingsOpacity, setSettingsOpacity] = useState(1);

  const handleSetInputVal = (e, primaryKey, itemKey) => {
    const settingObj = {
      [primaryKey]: {
        [itemKey]: e.target.value,
      },
    };

    dispatch(changeSetting(settingObj));
  };

  const renderSubSetting = (primaryKey, subSetting) => {
    return Object.entries(subSetting).map((item) => (
      <StyledSubsettingsList key={item[0]}>
        {item[0]}:{' '}
        <input
          type='text'
          value={settings[primaryKey][item[0]]}
          onChange={(e) => handleSetInputVal(e, primaryKey, item[0])}
        />
      </StyledSubsettingsList>
    ));
  };

  const renderSettingsList = () => {
    return Object.entries(themeContext).map((item) => (
      <StyledSettingsList key={item[0]}>
        {item[0]}: {renderSubSetting(item[0], item[1])}
      </StyledSettingsList>
    ));
  };

  const handleResetToDefaults = () => {
    ipcRenderer.send('reset-settings-to-default');
  };

  return (
    <StyledSettings settingsOpacity={settingsOpacity}>
      <StyledNav>
        <StyledRange
          type='range'
          id='volume'
          name='volume'
          min='0'
          max='1'
          step='0.01'
          value={settingsOpacity}
          onChange={(e) => setSettingsOpacity(e.target.value)}
        />{' '}
        <StyledCloseBtn onClick={onClose}>
          <Icon iconName='ChromeClose' />
        </StyledCloseBtn>
      </StyledNav>

      <StyledHeading>Settings</StyledHeading>
      {renderSettingsList()}
      <button onClick={handleResetToDefaults}>Reset to defaults</button>
    </StyledSettings>
  );
};

export default Settings;
