import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HardDrive from '../HardDrive';
import styled from 'styled-components';
import { hexToRgba } from 'hex-and-rgba';
import deerBg from '../../img/deer.svg';

const { remote, ipcRenderer, shell } = window.require('electron');
const mainProcess = remote.require('./index.js');

const StyledContent = styled.div`
  background-color: ${({ theme }) =>
    hexToRgba(theme.bg.appBg + 'cc').toString()};
  overflow-y: auto;
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;

const StyledDrivesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  grid-gap: 1rem;
  justify-content: center;
  align-content: start;
  justify-items: center;
  align-items: center;
`;

const StyledFavWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
  grid-gap: 1rem;
  justify-content: center;
  align-content: start;
  justify-items: center;
  align-items: center;
`;

const StyledHeading = styled.h1`
  display: flex;
  justify-content: center;
  align-content: center;
  margin: 3rem 0;
  font-size: 3rem;
  font-weight: 100;
`;

const NewTabContent = () => {
  const activeTab = useSelector((state) => state.activeTab);
  const tabs = useSelector((state) => state.tabs);
  const drives = useSelector((state) => state.drives);
  const dispatch = useDispatch();

  const handleOpenDirectory = (newPath, name) => {
    ipcRenderer.send('open-directory', activeTab, newPath);
  };

  useEffect(() => {
    ipcRenderer.send('get-drives');
  }, []);

  return (
    <StyledContent>
      <StyledHeading>Your Hard Drives</StyledHeading>
      <StyledDrivesWrapper>
        {drives.map((item, i) => (
          <HardDrive
            key={item.filesystem}
            {...item}
            handleOpenDirectory={() =>
              handleOpenDirectory(item.mounted + '/', item.mounted + '/')
            }
          />
        ))}
      </StyledDrivesWrapper>
      <StyledHeading>Favorites</StyledHeading>
      <StyledFavWrapper>
        <div>Fav 1</div>
        <div>Fav 2</div>
        <div>Fav 3</div>
        <div>Fav 4</div>
        <div>Fav 5</div>
      </StyledFavWrapper>
    </StyledContent>
  );
};

export default NewTabContent;
