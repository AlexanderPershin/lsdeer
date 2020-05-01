import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDir } from '../../actions/tabsActions';
import HardDrive from '../HardDrive';
import styled from 'styled-components';
import { hexToRgba } from 'hex-and-rgba';

const { remote, ipcRenderer, shell } = window.require('electron');
const mainProcess = remote.require('./index.js');

const StyledContent = styled.div`
  background-color: ${({ theme }) =>
    hexToRgba(theme.bg.appBg + 'cc').toString()};
  min-height: 100%;
  grid-row: 1 / 3;
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
  const dispatch = useDispatch();

  const [drives, setDrives] = useState([]);

  const parseDrivesData = (respDrivesArr) => {
    const createDrive = (headers, dataArr) => {
      const drive = {};
      headers.map((item, i) => (drive[item] = dataArr[i]));

      if (drive.mounted === '/') {
        let driveLetter = drive.filesystem.toLowerCase().split('')[0];
        drive.mounted = `/${driveLetter}`;
      }

      return drive;
    };

    let parsedDrives = [];
    const stage0Data = respDrivesArr
      .map((item) => item.split(' ').filter((item) => item !== ''))
      .filter((item) => item.length > 0);

    let tableHeaders = stage0Data.shift();

    tableHeaders = tableHeaders.map((item) => {
      return item.replace(/%/g, '').toLowerCase();
    });

    parsedDrives = stage0Data.map((driveData) => {
      driveData[0] = driveData[0].slice(0, 2);
      return createDrive(tableHeaders, driveData);
    });

    return parsedDrives;
  };

  const handleOpenDirectory = (newPath, name) => {
    dispatch(openDir(activeTab, newPath, name));
  };

  useEffect(() => {
    ipcRenderer.send('get-disks');

    ipcRenderer.on('resp-shelljs', (event, data) => {
      setDrives(parseDrivesData(data.response));
    });

    return () => {
      ipcRenderer.removeAllListeners('resp-shelljs', (event, data) => {
        setDrives(parseDrivesData(data.response));
      });
    };
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
    </StyledContent>
  );
};

export default NewTabContent;
