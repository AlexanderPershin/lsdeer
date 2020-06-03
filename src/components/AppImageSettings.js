import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Icon } from '@fluentui/react/lib/Icon';
import Select from './Inputs/Select';

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

const FileInputButton = styled.label`
  justify-self: start;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  & > *:first-child {
    margin-right: 1rem;
  }
`;

const StyledFileInput = styled.input`
  display: none;
`;

const StyledCurrentBg = styled.img`
  grid-column: 2 / 3;
  grid-row: 3 / 8;
  width: auto;
  height: 100%;
  object-fit: contain;
`;

const StyledCurrentBgLabel = styled.span`
  grid-row: 3 / 8;
`;

const bgSizeOpts = [
  { label: 'Cover', value: 'cover' },
  { label: 'Contain', value: 'contain' },
];

const AppImageSettings = ({ handleSetProp }) => {
  const themeContext = useContext(ThemeContext);

  const handleSetAppImage = (e) => {
    e.preventDefault();
    const imagePath = e.target.files[0].path;
    const imagPathUrl = `http://localhost:15032/bg/${encodeURIComponent(
      imagePath
    )}`;
    handleSetProp(false, 'bg', 'appBgImage', imagPathUrl);
  };

  return (
    <StyledInputsWrapper>
      <StyledSettingsGroupHeding>
        App background image
      </StyledSettingsGroupHeding>
      <span>Load app image</span>
      <FileInputButton htmlFor='app-image'>
        <span>Choose</span>
        <Icon className='custom-select' iconName='PictureFill' />
        <StyledFileInput
          onChange={handleSetAppImage}
          type='file'
          name='app-image'
          id='app-image'
          placeholder='Select background'
        />
      </FileInputButton>

      <StyledCurrentBgLabel>Current background</StyledCurrentBgLabel>
      <StyledCurrentBg src={themeContext.bg.appBgImage} alt='' />

      <span>Background size</span>
      <Select
        value={themeContext.bg.appBgSize}
        optionsArray={bgSizeOpts}
        onChange={(newVal) => handleSetProp(false, 'bg', 'appBgSize', newVal)}
      />
    </StyledInputsWrapper>
  );
};

export default AppImageSettings;
