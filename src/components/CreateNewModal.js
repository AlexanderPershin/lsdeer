import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { toggleNewFileFolder } from '../actions/newFileFolderActions';

import Button from './Button';

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.bg.appBg};
  font-size: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
`;

const StyledModalContent = styled.div`
  width: 50vw;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme.bg.secondaryBg};
`;

const StyledChooseBtns = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  & > *:first-child {
    margin-right: 5px;
  }
  & > * {
    flex: 1;
  }
`;

const StyledChooseBtn = styled(Button)`
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.bg.selectedBg : theme.bg.accentBg};
`;

// TODO: Add showCreateModal reducer and action
// add selector here and emit ipcRenderer event on confirmation

const CreateNewModal = () => {
  const [isFolder, setIsFolder] = useState(true);
  const [name, setName] = useState('');

  const dispatch = useDispatch();

  const handleCreateFolder = () => {
    setIsFolder(true);
  };

  const handleCreateFile = () => {
    setIsFolder(false);
  };

  const handleCancel = () => {
    dispatch(toggleNewFileFolder());
  };

  return (
    <StyledModal>
      <StyledModalContent>
        <h1>Create new {isFolder ? 'folder' : 'file'}</h1>
        <StyledChooseBtns>
          <StyledChooseBtn onClick={handleCreateFolder} isSelected={isFolder}>
            Folder
          </StyledChooseBtn>
          <StyledChooseBtn onClick={handleCreateFile} isSelected={!isFolder}>
            File
          </StyledChooseBtn>
        </StyledChooseBtns>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Enter ${isFolder ? 'folder' : 'file'}\'s name here`}
        />
        <div>
          <Button>Ok</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      </StyledModalContent>
    </StyledModal>
  );
};

export default CreateNewModal;
