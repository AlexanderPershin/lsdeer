import React from 'react';
import styled from 'styled-components';
import { Icon } from '@fluentui/react/lib/Icon';
const { ipcRenderer } = window.require('electron');

const StyledCreateNewBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.appColor};
  padding: 0 5px;
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.font.pathBarFontSize};
  &:hover {
    background-color: ${({ theme }) => theme.bg.selectedBg};
  }
  &:disabled {
    background-color: lightgray;
    cursor: default;
  }
`;

const CreateNewBtn = () => {
  const handleCreateNew = () => {
    ipcRenderer.send('create-file-or-dir');
  };

  return (
    <StyledCreateNewBtn onClick={handleCreateNew}>
      <Icon iconName="FabricNewFolder" className="ms-IconExample" />
    </StyledCreateNewBtn>
  );
};

export default CreateNewBtn;
