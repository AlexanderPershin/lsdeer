import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import NumInp from '../Inputs/NumInp';
import Select from '../Inputs/Select';

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

const fontOptions = [
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Lato', value: 'Lato, sans-serif' },
  { label: 'Raleway', value: 'Raleway, sans-serif' },
];

const FontSettings = ({ handleSetProp }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <StyledInputsWrapper>
      <StyledSettingsGroupHeding>Font</StyledSettingsGroupHeding>
      <span>Font size</span>
      <NumInp
        min={10}
        max={50}
        step={0.5}
        disabled={false}
        value={themeContext.font.appFontSize}
        handleSetProp={(newVal) =>
          handleSetProp(false, 'font', 'appFontSize', newVal)
        }
      />

      <span>Font-Family</span>
      <Select
        value={themeContext.font.appFontFamily}
        optionsArray={fontOptions}
        onChange={(newVal) =>
          handleSetProp(false, 'font', 'appFontFamily', newVal)
        }
      />
    </StyledInputsWrapper>
  );
};

export default FontSettings;
