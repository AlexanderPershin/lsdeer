import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Icon } from '@fluentui/react/lib/Icon';
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';

const StyledNumInput = styled(InputNumber)`
  border-radius: 0;
  border: 1px solid ${({ theme }) => theme.colors.appColor} !important;

  & > div > input {
    border-radius: 0;
    background-color: transparent;
    color: inherit;
  }
  &:focus,
  &:hover,
  &:active {
    border: none;
    outline: ${({ theme }) =>
      `${theme.sizes.focusOutlineWidth} solid ${theme.bg.selectedBg}`} !important;
  }
`;

const StyledHandleIcon = styled(Icon)`
  font-size: 8px;
`;

const NumInp = ({ handleSetProp }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <StyledNumInput
      aria-label='Font size'
      min={10}
      max={50}
      step={0.5}
      value={themeContext.font.appFontSize}
      style={{ width: 75, border: 'none', outline: 'none' }}
      readOnly={false}
      onChange={(newVal) => handleSetProp(false, 'font', 'appFontSize', newVal)}
      upHandler={<StyledHandleIcon iconName='Add' />}
      downHandler={<StyledHandleIcon iconName='Remove' />}
      disabled={false}
    />
  );
};

export default NumInp;
