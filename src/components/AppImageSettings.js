import React from 'react';
import styled from 'styled-components';

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

const AppImageSettings = ({ handleSetProp }) => {
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
      <input
        onChange={handleSetAppImage}
        type='file'
        name='app-image'
        id='app-image'
      />
    </StyledInputsWrapper>
  );
};

export default AppImageSettings;
