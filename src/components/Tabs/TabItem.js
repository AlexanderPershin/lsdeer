import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { openDir } from '../../actions/tabsActions';

const { remote, ipcRenderer, shell } = window.require('electron');
const mainProcess = remote.require('./index.js');

// TODO: Refactor code make it more clear
//

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

  // useEffect(() => {
  //   ipcRenderer.on('resp-dir', (event, data) => {
  //     const newContent = data.response.split('\n');

  //     dispatch(openDir(activeTab, newPath + '/' + name, newContent, name));
  //   });

  //   return () => {
  //     ipcRenderer.removeListener('resp-dir', (event, data) => {
  //       const newContent = data.response.split('\n');

  //       dispatch(openDir(activeTab, newPath, newContent, name));
  //     });
  //   };
  // }, []);

  return <div onDoubleClick={handleOpenDirectory}>{name}</div>;
};

export default TabItem;
