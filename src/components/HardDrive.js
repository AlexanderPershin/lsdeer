import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Drive from '../img/Drive';

const StyledDriveWrapper = styled.button`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  color: inherit;
  background-color: ${({ theme }) => theme.bg.secondaryBg};
  border: 5px solid transparent;
  outline: ${({ theme }) => theme.sizes.focusOutlineWidth} solid transparent;
  font-family: inherit;
  &:focus {
    outline: ${({ theme }) => theme.sizes.focusOutlineWidth} solid
      ${({ theme }) => theme.bg.selectedBg};
    background-color: ${({ theme }) => theme.bg.selectedBg};
  }
`;

const StyledProgress = styled.div`
  width: 100%;
  height: 1.8rem;
  background-color: ${({ theme }) => theme.bg.activeTabBg};
  border: 3px solid ${({ theme }) => theme.bg.activeTabBg};
  position: relative;
  &::before {
    position: absolute;
    content: '${({ currentInfo }) => currentInfo}';
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    color: transparent;
    transition: all 0.3s ease-in-out;
    white-space: nowrap;
  }
  ${StyledDriveWrapper}:hover &::before, ${StyledDriveWrapper}:focus &::before {
    color: ${({ theme }) => theme.colors.appColor};
    text-shadow: 0 0 10px rgba(0,0,0,0.5);
  }
`;

const StyledProgressBar = styled.div`
  width: ${({ percentage }) => percentage};
  height: 100%;
  background-color: ${({ theme }) => theme.bg.accentBg};
  display: flex;
  justify-content: center;
  align-items: center;
  color: transparent;
`;

const StyledDriveLetter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  background-color: transparent;
`;

const StyledDriveSize = styled.div`
  background-color: ${({ theme }) => theme.bg.accentBg};
  padding: 0.1rem;
  font-size: 1rem;
  align-self: flex-start;
  justify-self: flex-end;
`;

const StyledDriveInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const StyledDriveStats = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
`;

const HardDrive = ({
  filesystem,
  size,
  used,
  avail,
  use,
  mounted,
  handleOpenDirectory,
}) => {
  const [currInfo, setCurrInfo] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrInfo((prev) => {
        switch (currInfo) {
          case 1:
            return 2;
          case 2:
            return 3;
          case 3:
            return 1;
          default:
            return 1;
        }
      });
    }, 1500);
    return () => {
      clearInterval(timer);
    };
  }, [currInfo]);

  const renderInfo = () => {
    switch (currInfo) {
      case 1:
        return `${used} used`;
      case 2:
        return `${use} used`;
      case 3:
        return `${avail} available`;
      default:
        return `${used} used`;
    }
  };

  return (
    <StyledDriveWrapper
      onDoubleClick={() => handleOpenDirectory(mounted, filesystem)}
    >
      <Drive color="#fff" />
      <StyledDriveInfo>
        <StyledDriveStats>
          <StyledDriveLetter>{filesystem}</StyledDriveLetter>
          <StyledDriveSize>{size}</StyledDriveSize>
        </StyledDriveStats>
        <StyledProgress currentInfo={renderInfo()}>
          <StyledProgressBar percentage={use}>{use}</StyledProgressBar>
        </StyledProgress>
      </StyledDriveInfo>
    </StyledDriveWrapper>
  );
};

export default HardDrive;
