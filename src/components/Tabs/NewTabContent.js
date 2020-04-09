import React, { useEffect, useState } from 'react';
import HardDrive from '../HardDrive';
import styled from 'styled-components';

const { remote, ipcRenderer, shell } = window.require('electron');
const mainProcess = remote.require('./index.js');

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
  const [drives, setDrives] = useState([]);

  const lsDir = (path) => {
    ipcRenderer.send('ls-directory', path);
  };

  const getDisks = () => {
    ipcRenderer.send('get-disks');
  };

  const parseDrivesData = (respDrivesArr) => {
    const createDrive = (headers, dataArr) => {
      const drive = {};
      headers.map((item, i) => (drive[item] = dataArr[i]));
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

  useEffect(() => {
    getDisks();

    ipcRenderer.on('resp-shelljs', (event, data) => {
      setDrives(parseDrivesData(data.response));
    });
  }, []);

  return (
    <div>
      <StyledHeading>Your Hard Drives</StyledHeading>
      <StyledDrivesWrapper>
        {drives.map((item, i) => (
          <HardDrive key={item.filesystem} {...item} />
        ))}
      </StyledDrivesWrapper>
      <StyledHeading>Favorites</StyledHeading>
    </div>
  );
};

export default NewTabContent;
