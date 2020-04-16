import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { openDir } from '../../actions/tabsActions';
import { hexToRgba } from 'hex-and-rgba';
import FileIcon from './FileIcon';

const { remote, ipcRenderer, shell } = window.require('electron');
const mainProcess = remote.require('./index.js');

// background-color: ${({ theme }) => hexToRgba(theme.bg.folderBg + 'cc').toString()};

const StyledItem = styled.div`
  background-color: ${({ theme, sel }) =>
    sel ? hexToRgba(theme.bg.folderBg + 'cc').toString() : 'none'};
  user-select: none;
  cursor: pointer;
`;

const TabItem = ({ name, path, isFile, ext, selected, handleSelect }) => {
  const activeTab = useSelector((state) => state.activeTab);
  const tabs = useSelector((state) => state.tabs);
  const dispatch = useDispatch();

  const handleOpenDirectory = () => {
    const activePath = tabs.filter((item) => item.id === activeTab)[0].path;
    const newPath = `${activePath}/${name}`;

    dispatch(openDir(activeTab, newPath));
  };

  // TODO: jpg image preview + icons for each file extention

  return (
    <StyledItem
      onDoubleClick={handleOpenDirectory}
      onClick={() => handleSelect(name)}
      sel={selected === name}
    >
      <FileIcon ext={ext} />
      {name}
    </StyledItem>
  );
};

export default TabItem;
