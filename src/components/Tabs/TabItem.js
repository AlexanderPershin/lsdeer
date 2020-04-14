import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { openDir } from '../../actions/tabsActions';
import { hexToRgba } from 'hex-and-rgba';

const { remote, ipcRenderer, shell } = window.require('electron');
const mainProcess = remote.require('./index.js');

const StyledItem = styled.div`
  background-color: ${({ theme }) =>
    hexToRgba(theme.bg.folderBg + 'cc').toString()};
  user-select: none;
  cursor: pointer;
`;

const TabItem = ({ name }) => {
  const activeTab = useSelector((state) => state.activeTab);
  const tabs = useSelector((state) => state.tabs);
  const dispatch = useDispatch();

  const [newPath, setNewPath] = useState(activeTab.path);

  const handleOpenDirectory = () => {
    const activePath = tabs.filter((item) => item.id === activeTab)[0].path;
    const newPath = `${activePath}/${name}`;

    dispatch(openDir(activeTab, newPath));
  };

  return <StyledItem onDoubleClick={handleOpenDirectory}>{name}</StyledItem>;
};

export default TabItem;
