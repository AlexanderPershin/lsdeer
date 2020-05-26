import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SketchPicker, ChromePicker } from 'react-color';
import { isValidRgba } from 'hex-and-rgba';

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

const StyledChromePicker = styled(ChromePicker)`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 300;
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

  return (
    <StyledPickerWrapper>
      <StyledInputButton bg={value} onClick={toggleOpen} />
      {isOpen ? (
        <StyledChromePicker
          color={color}
          onChange={handleChange}
          onChangeComplete={handleComplete}
        />
      ) : null}
    </StyledPickerWrapper>
  );
};

export default ColorInput;
