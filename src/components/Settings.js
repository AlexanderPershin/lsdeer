import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { ThemeContext } from 'styled-components';
import {
  setSettings,
  clearSettings,
  changeSetting,
} from '../actions/settingsActions';

import { Icon } from '@fluentui/react/lib/Icon';
import NumInp from './Inputs/NumInp';
import Select from './Inputs/Select';
import ColorSchemeSettings from './ColorSchemeSettings';
import FontSettings from './FontSettings';
import SizesSettings from './SizesSettings';

const { ipcRenderer } = window.require('electron');

const StyledSettings = styled.div`
  position: fixed;
  top: 30px;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: ${({ theme }) => theme.bg.settingsBg};
  color: ${({ theme }) => theme.colors.appColor};
  padding: 5px;
  z-index: 900;
  overflow-y: auto;
  opacity: ${({ settingsOpacity }) => settingsOpacity};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
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
  box-shadow: ${({ theme }) =>
    `${theme.shadows.navShadowOffsetX}px ${theme.shadows.navShadowOffsetY}px ${theme.shadows.navShadowBlur}px ${theme.shadows.navShadowSpread}px ${theme.shadows.navShadowColor}`};
`;

const StyledCloseBtn = styled.button`
  font-size: 1rem;
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.appColor};
  cursor: pointer;
  outline: none;
  &:hover {
    color: ${({ theme }) => theme.bg.appBarXBtnHover};
  }
`;

const StyledControls = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  margin-top: 2rem;
`;

const StyledBtn = styled.button`
  color: inherit;
  padding: 5px 15px;
  border: none;
  background-color: ${({ theme }) => theme.bg.appBarBg};
  &:hover {
    background-color: ${({ theme }) => theme.bg.selectedBg};
    cursor: pointer;
  }
  &:focus {
    outline: ${({ theme }) =>
      `${theme.sizes.focusOutlineWidth} solid ${theme.bg.selectedBg}`};
  }
  & + & {
    margin-top: 5px;
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

const StyledSettingsTabs = styled.div`
  display: flex;
  /* width: 100%; */
  justify-content: center;
  align-items: center;
`;

const StyledSettingsTab = styled.div`
  flex: 1 1 0%;
  padding: 5px 15px;
  border: none;
  background-color: ${({ theme, selected }) =>
    selected ? theme.bg.selectedBg : theme.bg.tabBg};
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.bg.selectedBg};
  }
`;

const Settings = ({ onClose }) => {
  const themeContext = useContext(ThemeContext);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const [settingsOpacity, setSettingsOpacity] = useState(1);
  const [settingsTab, setSettingsTab] = useState(1);

  const handleSetProp = (e, settingGroupKey, settingKey, newVal) => {
    let settingObj;

    if (e) {
      settingObj = {
        [settingGroupKey]: {
          [settingKey]: e.target.value,
        },
      };
    } else {
      settingObj = {
        [settingGroupKey]: {
          [settingKey]: newVal,
        },
      };
    }

    dispatch(changeSetting(settingObj));
  };

  const handleResetToDefaults = () => {
    ipcRenderer.send('reset-settings-to-default');
  };

  const handleApplySettings = () => {
    ipcRenderer.send('apply-settings-event');
  };

  const renderSettingsTab = () => {
    switch (settingsTab) {
      case 1:
        return <ColorSchemeSettings handleSetProp={handleSetProp} />;
      case 2:
        return <FontSettings handleSetProp={handleSetProp} />;
      case 3:
        return <SizesSettings handleSetProp={handleSetProp} />;
      default:
        return <ColorSchemeSettings handleSetProp={handleSetProp} />;
    }
  };

  return (
    <React.Fragment>
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
        />
        <StyledCloseBtn onClick={onClose}>
          <Icon title='Settings will not be saved!' iconName='ChromeClose' />
        </StyledCloseBtn>
      </StyledNav>
      <StyledSettings settingsOpacity={settingsOpacity}>
        <StyledHeading>Settings</StyledHeading>

        <StyledSettingsTabs>
          <StyledSettingsTab
            selected={settingsTab === 1}
            onClick={(e) => setSettingsTab(1)}
          >
            Color Scheme
          </StyledSettingsTab>
          <StyledSettingsTab
            selected={settingsTab === 2}
            onClick={(e) => setSettingsTab(2)}
          >
            Font
          </StyledSettingsTab>
          <StyledSettingsTab
            selected={settingsTab === 3}
            onClick={(e) => setSettingsTab(3)}
          >
            Sizes
          </StyledSettingsTab>
        </StyledSettingsTabs>

        {renderSettingsTab()}

        <StyledControls>
          <StyledBtn onClick={handleApplySettings}>Apply</StyledBtn>
          <StyledBtn
            onClick={handleResetToDefaults}
            title='This button resets ALL settings to defaults, not only current tab!'
          >
            Reset All to defaults
          </StyledBtn>
        </StyledControls>
      </StyledSettings>
    </React.Fragment>
  );
};

export default Settings;
