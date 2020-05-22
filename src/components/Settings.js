import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { ThemeContext } from 'styled-components';
import {
  setSettings,
  clearSettings,
  changeSetting,
} from '../actions/settingsActions';

import { Icon } from '@fluentui/react/lib/Icon';
import NumInp from './NumInp';

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

const StyledColorInp = styled.input`
  cursor: pointer;
`;

const StyledControls = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
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
    margin-left: 15px;
  }
`;

const StyledInputsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 35px;
  grid-gap: 20px;
  align-items: center;
`;

const StyledSettingsGroupHeding = styled.h2`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  margin: 1rem 0;
  font-size: 2rem;
  font-weight: 100;
  padding-top: 15px;
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

const Settings = ({ onClose }) => {
  const themeContext = useContext(ThemeContext);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const [settingsOpacity, setSettingsOpacity] = useState(1);

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
          <Icon iconName='ChromeClose' />
        </StyledCloseBtn>
      </StyledNav>
      <StyledSettings settingsOpacity={settingsOpacity}>
        <StyledHeading>Settings</StyledHeading>

        <StyledInputsWrapper>
          <StyledSettingsGroupHeding>App styles</StyledSettingsGroupHeding>
          <span>Font color</span>
          <StyledColorInp
            type='color'
            value={themeContext.colors.appColor}
            onChange={(e) => handleSetProp(e, 'colors', 'appColor')}
          />

          <span>Font size</span>
          <NumInp handleSetProp={handleSetProp} />

          <span>Background color</span>
          <StyledColorInp
            type='color'
            value={themeContext.bg.appBg}
            onChange={(e) => handleSetProp(e, 'bg', 'appBg')}
          />

          <span>Selection background color</span>
          <StyledColorInp
            type='color'
            value={themeContext.bg.selectedBg}
            onChange={(e) => handleSetProp(e, 'bg', 'selectedBg')}
          />

          <span>Ui elements background color</span>
          <StyledColorInp
            type='color'
            value={themeContext.bg.tabBg}
            onChange={(e) => handleSetProp(e, 'bg', 'tabBg')}
          />

          <span>Secondary ui elements background color</span>
          <StyledColorInp
            type='color'
            value={themeContext.bg.elementsBg}
            onChange={(e) => handleSetProp(e, 'bg', 'elementsBg')}
          />

          <span>Active ui element background color</span>
          <StyledColorInp
            type='color'
            value={themeContext.bg.activeTabBg}
            onChange={(e) => handleSetProp(e, 'bg', 'activeTabBg')}
          />

          <span>Scrollbar hover background color</span>
          <StyledColorInp
            type='color'
            value={themeContext.bg.scrollbarBg}
            onChange={(e) => handleSetProp(e, 'bg', 'scrollbarBg')}
          />

          <span>Accent background color</span>
          <StyledColorInp
            type='color'
            value={themeContext.bg.accentBg}
            onChange={(e) => handleSetProp(e, 'bg', 'accentBg')}
          />

          <span>Input background color</span>
          <StyledColorInp
            type='color'
            value={themeContext.bg.inputBg}
            onChange={(e) => handleSetProp(e, 'bg', 'inputBg')}
          />

          <span>Secondary background color</span>
          <StyledColorInp
            type='color'
            value={themeContext.bg.secondaryBg}
            onChange={(e) => handleSetProp(e, 'bg', 'secondaryBg')}
          />
          <StyledSettingsGroupHeding>App bar styles</StyledSettingsGroupHeding>

          <span>Background</span>
          <StyledColorInp
            type='color'
            value={themeContext.bg.appBarBg}
            onChange={(e) => handleSetProp(e, 'bg', 'appBarBg')}
          />

          <span>Title color</span>
          <StyledColorInp
            type='color'
            value={themeContext.colors.appTitleColor}
            onChange={(e) => handleSetProp(e, 'colors', 'appTitleColor')}
          />

          <span>Active item background</span>
          <StyledColorInp
            type='color'
            value={themeContext.bg.appBarActiveItemBg}
            onChange={(e) => handleSetProp(e, 'bg', 'appBarActiveItemBg')}
          />

          <span>Close button background</span>
          <StyledColorInp
            type='color'
            value={themeContext.bg.appBarXBtnHover}
            onChange={(e) => handleSetProp(e, 'bg', 'appBarXBtnHover')}
          />

          <StyledControls>
            <StyledBtn onClick={() => alert('You sooo applied changes')}>
              Apply
            </StyledBtn>
            <StyledBtn onClick={handleResetToDefaults}>
              Reset to defaults
            </StyledBtn>
          </StyledControls>
        </StyledInputsWrapper>
      </StyledSettings>
    </React.Fragment>
  );
};

export default Settings;
