import React, { useContext, useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { rgbaToHex, hexToRgba } from 'hex-and-rgba';
import ColorInput from './ColorInput';

const StyledInputsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 35px;
  grid-gap: 20px;
  align-items: center;
  & > span {
    justify-self: end;
  }
`;

const StyledSettingsGroupHeding = styled.h2`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-content: center;
  margin: 1rem 0;
  font-size: 2rem;
  font-weight: 100;
  padding-top: 15px;
`;

const StyledColorInp = styled.input`
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  width: 4.5rem;
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &:focus,
  &:hover,
  &:active {
    outline: ${({ theme }) =>
      `${theme.sizes.focusOutlineWidth} solid ${theme.bg.selectedBg}`};
  }
`;

const ColorSchemeSettings = ({ handleSetProp }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <StyledInputsWrapper>
      <StyledSettingsGroupHeding>Color Scheme</StyledSettingsGroupHeding>
      <span>Font color</span>
      <StyledColorInp
        type='color'
        value={themeContext.colors.appColor}
        onChange={(e) => handleSetProp(e, 'colors', 'appColor')}
      />

      <span>Background color</span>
      <ColorInput
        value={themeContext.bg.appBg}
        onChange={(newVal) => handleSetProp(false, 'bg', 'appBg', newVal)}
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

      <span>Menu shadow color</span>
    </StyledInputsWrapper>
  );
};

export default ColorSchemeSettings;
