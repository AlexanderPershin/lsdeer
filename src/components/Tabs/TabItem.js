import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { openDir } from '../../actions/tabsActions';
import { hexToRgba } from 'hex-and-rgba';
import {
  addSelectedFiles,
  clearSelectedFiles,
} from '../../actions/selectFilesActions';

// fluentui
import { Icon } from '@fluentui/react/lib/Icon';
import { getFileTypeIconProps, FileIconType } from '@uifabric/file-type-icons';

// const { remote, ipcRenderer, shell } = window.require('electron');
// const mainProcess = remote.require('./index.js');

const StyledItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ theme, sel }) =>
    sel ? hexToRgba(theme.bg.selectedBg + 'cc').toString() : 'transparent'};
  z-index: ${({ sel }) => (sel ? 10 : 5)};
  user-select: none;
  cursor: pointer;
  position: relative;
  padding: 5px;
  border: none;
  outline: none;
  color: inherit;
  font-size: inherit;
  &:active,
  &:focus {
    background-color: ${({ theme }) => theme.bg.selectedBg};
  }
`;

const StyledName = styled.span`
  background-color: ${({ theme, sel }) =>
    sel ? hexToRgba(theme.bg.selectedBg + 'cc').toString() : 'transparent'};
  width: 100px;
  white-space: normal;
  word-wrap: break-word;
  text-align: center;
`;

const truncate = (input, num) =>
  input.length > num ? `${input.substring(0, num)}...` : input;

const TabItem = ({ name, path, isFile, ext, selected, handleSelect }) => {
  const activeTab = useSelector((state) => state.activeTab);
  const tabs = useSelector((state) => state.tabs);
  const selectedStore = useSelector((state) => state.selected);
  const dispatch = useDispatch();

  let clickTimeout = null;
  const clickDelay = 200;

  const handleOpenDirectory = (e) => {
    console.log('TabItem openDirectory');

    const activePath = tabs.filter((item) => item.id === activeTab)[0].path;
    const newPath = `${activePath}${name}`;

    dispatch(openDir(activeTab, newPath));
  };

  const handleSelectThis = useCallback((e) => handleSelect(e, name), [
    handleSelect,
    name,
  ]);

  useEffect(() => {
    clearTimeout(clickTimeout);
    clickTimeout = null;
    console.log('render item');
  }, []);

  const handleClicks = (e) => {
    e.persist();
    if (clickTimeout !== null) {
      console.log('double click executes');
      handleOpenDirectory(e);

      clearTimeout(clickTimeout);
      clickTimeout = null;
      return;
    } else {
      console.log('single click');

      clickTimeout = setTimeout(() => {
        console.log('first click executes ');
        handleSelectThis(e);
        clearTimeout(clickTimeout);
        clickTimeout = null;
      }, clickDelay);
    }
  };

  return (
    <StyledItem onClick={handleClicks} id={name} name={name} sel={selected}>
      <Icon
        {...getFileTypeIconProps({
          type: isFile && ext ? '' : FileIconType.folder,
          extension: isFile && ext ? ext : '',
          size: 48,
          imageFileType: 'svg',
        })}
      />
      <StyledName title={name} sel={selected}>
        {name && selected
          ? name
          : truncate(!isFile ? name.slice(0, -1) : name, 30)}
      </StyledName>
    </StyledItem>
  );
};

export default TabItem;
