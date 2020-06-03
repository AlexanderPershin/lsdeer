import React from 'react';
import styled from 'styled-components';
import { Icon } from '@fluentui/react/lib/Icon';
import InputNumber from 'rc-input-number';

const StyledNumInput = styled(InputNumber)`
  justify-self: start;
  margin: 0;
  padding: 0;
  line-height: 26px;
  font-size: 12px;
  height: 26px;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: stretch;
  outline: ${({ theme }) =>
    `${theme.sizes.focusOutlineWidth} solid ${theme.colors.appColor}`};
  border-radius: 0px;
  transition: all 0.3s;

  &.rc-input-number-focused {
    box-shadow: none;
    outline: ${({ theme }) =>
      `${theme.sizes.focusOutlineWidth} solid ${theme.bg.selectedBg}`};
  }
  .rc-input-number-handler {
    text-align: center;
    line-height: 10px;
    height: 12px;
    overflow: hidden;
    display: block;
    -ms-touch-action: none;
    touch-action: none;
  }

  &:hover {
    border-color: ${({ theme }) => theme.bg.selectedBg};
  }

  &:hover .rc-input-number-handler-up,
  &:hover .rc-input-number-handler-wrap {
    border-color: ${({ theme }) => theme.bg.selectedBg};
  }
  .rc-input-number-disabled:hover {
    border-color: #d9d9d9;
  }
  .rc-input-number-disabled:hover .rc-input-number-handler-up,
  .rc-input-number-disabled:hover .rc-input-number-handler-wrap {
    border-color: #d9d9d9;
  }
  .rc-input-number-input-wrap {
    overflow: hidden;
    height: 100%;
    width: 3rem;
    display: flex;
    justify-content: stretch;
    align-items: stretch;
  }
  .rc-input-number-input {
    width: 100%;
    text-align: center;
    outline: 0;
    -moz-appearance: textfield;
    line-height: 26px;
    font-size: ${({ theme }) => theme.font.appFontSize}px;
    height: 100%;
    transition: all 0.3s ease;
    background-color: ${({ theme }) => theme.bg.appBg};
    color: ${({ theme }) => theme.colors.appColor};
    border: 0;
    border-radius: 0px;
    padding: 0;
    transition: all 0.3s;
  }
  .rc-input-number-handler-wrap {
    float: right;
    width: auto;
    height: 100%;
    transition: all 0.3s;
    overflow: hidden;
    display: flex;
  }
  .rc-input-number-handler {
    background-color: ${({ theme }) => theme.bg.secondaryBg};
    height: 100%;
    width: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background-color: ${({ theme }) => theme.bg.selectedBg};
    }
  }
  .rc-input-number-handler-up {
    padding-top: 1px;
    transition: all 0.3s;
    border-left: 1px solid ${({ theme }) => theme.colors.appColor};
    order: 2;
  }
  .rc-input-number-handler-up-inner:after {
    content: '+';
  }
  .rc-input-number-handler-down {
    transition: all 0.3s;
  }
  .rc-input-number-handler-down-inner:after {
    content: '-';
  }
  .rc-input-number-handler-down-disabled,
  .rc-input-number-handler-up-disabled {
    opacity: 0.72;
  }
  .rc-input-number-handler-down-disabled:hover,
  .rc-input-number-handler-up-disabled:hover {
    color: #999;
    border-color: #d9d9d9;
  }
  .rc-input-number-disabled .rc-input-number-input {
    opacity: 0.72;
    cursor: not-allowed;
    background-color: #f3f3f3;
  }
  .rc-input-number-disabled .rc-input-number-handler {
    opacity: 0.72;
  }
  .rc-input-number-disabled .rc-input-number-handler:hover {
    color: #999;
    border-color: #d9d9d9;
  }
`;

const StyledHandleIcon = styled(Icon)`
  font-size: 8px;
`;

const NumInp = ({ min, max, step, disabled, value, handleSetProp }) => {
  const handleChange = (newVal) => {
    handleSetProp(newVal);
  };

  return (
    <StyledNumInput
      aria-label='Numeric input'
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      value={value}
      readOnly={false}
      onChange={handleChange}
      upHandler={<StyledHandleIcon iconName='Add' />}
      downHandler={<StyledHandleIcon iconName='Remove' />}
    />
  );
};

export default NumInp;
