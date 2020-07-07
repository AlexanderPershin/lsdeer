import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Icon } from '@fluentui/react/lib/Icon';

import { toggleNewFileFolder } from '../actions/newFileFolderActions';
import { clearSelectedFiles } from '../actions/selectFilesActions';

import Button from './Button';
import Heading from './Heading';

const { ipcRenderer, remote } = window.require('electron');
const nodePath = remote.require('path');

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
  position: relative;
  flex: 0 1 15rem;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.bg.secondaryBg};
  box-shadow: ${({ theme }) =>
    `${theme.shadows.menuShadowOffsetX}px ${theme.shadows.menuShadowOffsetY}px ${theme.shadows.menuShadowBlur}px ${theme.shadows.menuShadowSpread}px ${theme.shadows.menuShadowColor}`};
  & > * + * {
    margin-top: 1rem;
  }
`;

const StyledChooseBtns = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  & > * + * {
    margin-left: 5px;
  }
  & > * {
    flex: 0 1 0%;
  }
`;

const StyledChooseBtn = styled(Button)`
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.bg.selectedBg : theme.bg.accentBg};
`;

const StyledMainControls = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  & > *:first-child {
    margin-right: 5px;
  }
  & > * {
    flex: 0 1 0%;
  }
`;

const StyledCloseBtn = styled(Icon)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: white;
  &:hover {
    color: ${({ theme }) => theme.bg.appBarXBtnHover};
    cursor: pointer;
  }
`;

const StyledHeading = styled(Heading)`
  font-size: 2rem;
  margin: 0;
`;

const StyledInp = styled.input`
  font-size: 1.2rem;
  flex: 1 1 0%;
  padding: 5px;
`;

// TODO: Add showCreateModal reducer and action
// add selector here and emit ipcRenderer event on confirmation

const CreateNewModal = () => {
  const [createType, setCreateType] = useState('folder');
  const [name, setName] = useState('');
  const [oneOfManyNames, setOneOfMany] = useState('');
  const [many, setMany] = useState([]);

  const tabs = useSelector((state) => state.tabs);
  const activeTab = useSelector((state) => state.activeTab);
  const dispatch = useDispatch();

  const activeTabObject = tabs.find((item) => item.id === activeTab);
  const activeTabPath =
    activeTabObject.path.length <= 2
      ? activeTabObject.path
      : nodePath.normalize(activeTabObject.path);

  const handleCreateFolder = () => {
    setCreateType('folder');
  };

  const handleCreateFile = () => {
    setCreateType('file');
  };

  const handleCreateMany = () => {
    setCreateType('many');
  };

  const handleConfirm = (e) => {
    dispatch(clearSelectedFiles());
    if (!name || !activeTab) return;

    if (createType === 'folder') {
      ipcRenderer.send('new-folder', activeTabObject.path, name);
    } else if (createType === 'file') {
      ipcRenderer.send('new-file', activeTabObject.path, name);
    } else {
      ipcRenderer.send('new-many', activeTabObject, many);
    }
    dispatch(toggleNewFileFolder());
  };

  const handleAddToOthers = (isFile) => {
    if (!oneOfManyNames) return;
    setMany([...many, { name: oneOfManyNames, isFile }]);
  };

  const handleCancel = () => {
    dispatch(toggleNewFileFolder());
  };

  const renderMany = () => {
    return many.map((item, i) => (
      <li key={item.name + i}>
        {item.isFile ? 'File ' : 'Folder '} - {item.name}
      </li>
    ));
  };

  return (
    <StyledModal>
      <StyledModalContent>
        <StyledCloseBtn iconName="ChromeClose" onClick={handleCancel} />
        <StyledHeading>
          Create {createType === 'many' ? 'many' : 'new ' + createType}
        </StyledHeading>
        <StyledChooseBtns>
          <StyledChooseBtn
            onClick={handleCreateFolder}
            isSelected={createType === 'folder'}
          >
            Folder
          </StyledChooseBtn>
          <StyledChooseBtn
            onClick={handleCreateFile}
            isSelected={createType === 'file'}
          >
            File
          </StyledChooseBtn>
          <StyledChooseBtn
            onClick={handleCreateMany}
            isSelected={createType === 'many'}
          >
            Many
          </StyledChooseBtn>
        </StyledChooseBtns>
        <StyledInp disabled type="text" defaultValue={activeTabPath} />
        {createType === 'many' ? (
          <div>
            <ul>{renderMany()}</ul>
            <StyledInp
              type="text"
              value={oneOfManyNames}
              onChange={(e) => setOneOfMany(e.target.value)}
              placeholder={`Enter item name here`}
            />
            <Button onClick={() => handleAddToOthers(true)}>Add File</Button>
            <Button onClick={() => handleAddToOthers(false)}>Add Folder</Button>
          </div>
        ) : (
          <StyledInp
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Enter ${createType}\'s name here`}
          />
        )}
        <StyledMainControls>
          <Button onClick={handleConfirm}>Ok</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </StyledMainControls>
      </StyledModalContent>
    </StyledModal>
  );
};

export default CreateNewModal;
