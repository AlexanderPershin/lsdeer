import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Icon } from '@fluentui/react/lib/Icon';

import { toggleRenameModal } from '../actions/renameActions';
import { clearSelectedFiles } from '../actions/selectFilesActions';

import Button from './Button';
import Heading from './Heading';
import NumInp from './Inputs/NumInp';

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

const StyledItemName = styled.span`
  background-color: ${({ theme }) => theme.bg.accentBg};
  padding: 5px;
  max-height: 20vh;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 1rem;
    background-color: ${({ theme }) => theme.bg.activeTabBg};
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.bg.tabBg};
    border-left: 2px solid ${({ theme }) => theme.bg.activeTabBg};
    border-right: 2px solid ${({ theme }) => theme.bg.activeTabBg};
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.bg.scrollbarBg};
  }
`;

const StyledSpoiler = styled.details`
  width: 100%;
`;

const StyledSpoilerSummary = styled.summary`
  cursor: pointer;
  &:focus {
    outline: 1px solid ${({ theme }) => theme.bg.selectedBg};
  }
`;

const StyledSpoilerContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  & > * + * {
    margin-top: 5px;
  }
`;

const RenameModal = () => {
  const tabs = useSelector((state) => state.tabs);
  const activeTab = useSelector((state) => state.activeTab);
  const selectedStore = useSelector((state) => state.selected);
  const dispatch = useDispatch();

  const [name, setName] = useState(selectedStore[0] || '');
  const [starting, setStarting] = useState(1);
  const [pattern, setPattern] = useState('');

  const nameInpRef = useRef(null);
  const patternInpRef = useRef(null);

  const activeTabObject = tabs.find((item) => item.id === activeTab);
  const activeTabPath =
    activeTabObject.path.length <= 2
      ? activeTabObject.path
      : nodePath.normalize(activeTabObject.path);

  const handleConfirm = (e) => {
    // trigger event
    if (!name) return;
    if (selectedStore.length === 1) {
      ipcRenderer.send('rename', activeTabPath, selectedStore[0], name);
    } else if (selectedStore.length > 1) {
      if (!pattern.includes('[num]') && !pattern.includes('[name]')) {
        return;
      }
      ipcRenderer.send(
        'rename-many',
        activeTabPath,
        selectedStore,
        pattern,
        starting
      );
    }
    dispatch(clearSelectedFiles());
    dispatch(toggleRenameModal());
  };

  const handleCancel = () => {
    // close modal
    dispatch(toggleRenameModal());
  };

  const renderHeadingFileName = () => {
    if (selectedStore.length === 0) return;
    if (selectedStore && selectedStore.length === 1) {
      return selectedStore[0];
    } else {
      return selectedStore.reduce((prevVal, currentVal, currIndex, arr) => {
        return prevVal + ', ' + currentVal;
      });
    }
  };

  const handleReturn = (e) => {
    if (e.which === 13) {
      // Return pressed
      handleConfirm();
    } else {
      return;
    }
  };

  const handleNameInpChange = (e) => {
    let newVal = e.target.value;
    newVal = newVal.replace(/(\\|\/|\:|\*|\?|\"|\<|\>|\|)/g, '');
    setName(newVal);
  };

  const handlePatternInpChange = (e) => {
    let newVal = e.target.value;
    newVal = newVal.replace(/(\\|\/|\:|\*|\?|\"|\<|\>|\|)/g, '');
    setPattern(newVal);
  };

  useEffect(() => {
    try {
      if (selectedStore.length === 1) {
        nameInpRef.current.focus();
      } else if (selectedStore.length > 1) {
        patternInpRef.current.focus();
      }
    } catch (error) {}
  }, [selectedStore, selectedStore.length]);

  return (
    <StyledModal onKeyPress={handleReturn}>
      <StyledModalContent>
        <StyledCloseBtn iconName="ChromeClose" onClick={handleCancel} />
        <StyledHeading>Rename</StyledHeading>
        <StyledItemName>{renderHeadingFileName()}</StyledItemName>
        {selectedStore.length === 1 ? (
          <StyledInp
            type="text"
            ref={nameInpRef}
            autoFocus
            value={name}
            onChange={handleNameInpChange}
            placeholder={`Enter new name here`}
          />
        ) : (
          <>
            <StyledSpoiler>
              <StyledSpoilerSummary>Help</StyledSpoilerSummary>
              <StyledSpoilerContent>
                <span>[num] - add number</span>
                <span>[date] - add current date</span>
                <span>[name] - current name of file</span>
                <span>Example: [num]-[name]-hello-[date]</span>
              </StyledSpoilerContent>
            </StyledSpoiler>
            <StyledInp
              type="text"
              ref={patternInpRef}
              autoFocus
              value={pattern}
              onChange={handlePatternInpChange}
              placeholder={`Enter pattern here`}
            />
            <span>Starting</span>
            <NumInp
              min={1}
              max={10000}
              step={1}
              disabled={false}
              value={starting}
              handleSetProp={setStarting}
            />
          </>
        )}
        <StyledMainControls>
          <Button onClick={handleConfirm}>Ok</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </StyledMainControls>
      </StyledModalContent>
    </StyledModal>
  );
};

export default RenameModal;
