import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Icon } from '@fluentui/react/lib/Icon';

const StyledWrapper = styled.div`
  width: 100%;
  position: relative;
  font-family: ${({ theme }) => theme.font.appFontFamily};
`;

const StyledSelect = styled.select`
  display: none;
  background-color: ${({ theme }) => theme.bg.secondaryBg};
  color: ${({ theme }) => theme.colors.appColor};
  font-size: ${({ theme }) => theme.font.appFontSize}px;
  font-family: inherit;
  &:focus,
  &:hover,
  &:active {
    outline: ${({ theme }) =>
      `${theme.sizes.focusOutlineWidth} solid ${theme.bg.selectedBg}`};
  }
`;

const StyledSelectValue = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.bg.secondaryBg};
  padding: 0 5px;
  &:focus,
  &:hover,
  &:active {
    outline: ${({ theme }) =>
      `${theme.sizes.focusOutlineWidth} solid ${theme.bg.selectedBg}`};
  }
`;

const StyledSelectMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 100%;
`;

const StyledCustomOption = styled.div`
  background-color: ${({ theme }) => theme.bg.secondaryBg};
  padding: 0 5px;
  outline: ${({ theme, selected }) =>
    `${theme.sizes.focusOutlineWidth} solid ${
      selected ? theme.bg.selectedBg : 'transparent'
    }`};
  &:hover {
    background-color: ${({ theme }) => theme.bg.selectedBg};
  }
`;

// If isNative onChange should except event parameter else new value
const Select = ({ value, onChange, optionsArray, isNative = false }) => {
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const renderNativeOpts = () => {
    return optionsArray.map((item) => (
      <option value={item.value}>{item.label}</option>
    ));
  };

  const renderOpts = () => {
    return optionsArray.map((item) => (
      <StyledCustomOption
        className='custom-select'
        key={item.value}
        selected={value === item.value}
        onClick={(e) => handleOptClick(e, item.value)}
      >
        {item.label}
      </StyledCustomOption>
    ));
  };

  const handleToggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptClick = (e, val) => {
    setIsOpen(false);
    onChange(val);
  };

  const handleMisclick = (e) => {
    if (e.target.classList.contains('custom-select')) {
      return;
    } else {
      setIsOpen(false);
    }
  };

  const renderCurrentLabel = () => {
    return optionsArray.find((item) => item.value === value).label;
  };

  useEffect(() => {
    document.addEventListener('click', handleMisclick);
    return () => {
      document.removeEventListener('click', handleMisclick);
    };
  }, []);

  return isNative ? (
    <StyledSelect value={value} onChange={onChange}>
      {renderNativeOpts()}
    </StyledSelect>
  ) : (
    <StyledWrapper className='custom-select' ref={wrapperRef}>
      <StyledSelectValue className='custom-select' onClick={handleToggleMenu}>
        {renderCurrentLabel()}{' '}
        <Icon
          className='custom-select'
          iconName={isOpen ? 'ChevronUp' : 'ChevronDown'}
        />
      </StyledSelectValue>
      {isOpen ? <StyledSelectMenu>{renderOpts()}</StyledSelectMenu> : null}
    </StyledWrapper>
  );
};

export default Select;
