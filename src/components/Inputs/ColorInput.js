import React, { useState } from 'react';
import styled from 'styled-components';
import { SketchPicker } from 'react-color';
import { isValidRgba } from 'hex-and-rgba';
import Button from '../Button';

const StyledPickerWrapper = styled.div`
  position: relative;
  height: 100%;
`;

const StyledInputButton = styled.button`
  background-color: ${({ theme, bg }) => bg};
  width: 5rem;
  height: 100%;
  cursor: pointer;
  border: 1px solid #fff;
  &:focus,
  &:hover,
  &:active {
    outline: ${({ theme }) =>
      `${theme.sizes.focusOutlineWidth} solid ${theme.bg.selectedBg}`};
  }
`;

const StyledPickerContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  transform: translateX(-50%);
  z-index: 300;
  background-color: ${({ theme }) => theme.bg.tabBg};
  box-shadow: ${({ theme }) => theme.shadows.menuShadow};
`;

const StyledPicker = styled(SketchPicker)`
  background: ${({ theme }) => theme.bg.tabBg} !important;
  color: ${({ theme }) => theme.colors.appColor} !important;
  border-radius: 0 !important;
  box-shadow: none !important;
`;

const ColorInput = ({ value, onChange }) => {
  const [isOpen, setOpen] = useState(false);
  const [color, setColor] = useState(value);

  const toggleOpen = () => {
    if (isOpen && color !== undefined && isValidRgba(Object.values(color))) {
      onChange(`rgba(${Object.values(color)})`);
    }

    setOpen((prev) => {
      return !prev;
    });
  };

  const handleChange = (newVal) => {
    setColor(newVal.rgb);
  };

  const handleComplete = (newVal) => {
    setColor(newVal.rgb);
  };

  const handleOk = () => {
    if (isOpen && color !== undefined && isValidRgba(Object.values(color))) {
      onChange(`rgba(${Object.values(color)})`);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setColor(value);
    setOpen(false);
  };

  return (
    <StyledPickerWrapper>
      <StyledInputButton bg={value} onClick={toggleOpen} />
      {isOpen ? (
        <StyledPickerContainer>
          <StyledPicker
            color={color}
            onChange={handleChange}
            onChangeComplete={handleComplete}
          />
          <Button onClick={handleOk}>Ok</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </StyledPickerContainer>
      ) : null}
    </StyledPickerWrapper>
  );
};

export default ColorInput;
