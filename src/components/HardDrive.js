import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styled, { ThemeContext } from 'styled-components';
import Drive from '../img/Drive';

const StyledDiskWrapper = styled.button`
  max-width: 10rem;
  max-height: 10rem;
  min-width: 10rem;
  min-height: 10rem;
  user-select: none;
  color: inherit;
  background: transparent;
  border-radius: 1000rem;
  border: ${({ theme }) => theme.sizes.focusOutlineWidth} solid transparent;
  outline: none;
  &:focus {
    border: ${({ theme }) => theme.sizes.focusOutlineWidth} solid
      ${({ theme }) => theme.bg.selectedBg};
  }
`;

const StyledDiskContent = styled.div`
  font-size: 1.2rem;
  margin: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  const themeContext = useContext(ThemeContext);
  const percentage = parseInt(use.replace(/%/g, ''));

  return (
    <StyledDiskWrapper
      onDoubleClick={() => handleOpenDirectory(mounted, filesystem)}
    >
      <CircularProgressbarWithChildren
        ressbar
        minValue={0}
        maxValue={100}
        value={percentage}
        background
        backgroundPadding={1}
        styles={buildStyles({
          backgroundColor: themeContext.bg.accentBg,
          pathColor: themeContext.bg.elementsBg,
          trailColor: themeContext.bg.appBg,
        })}
      >
        <StyledDiskContent>
          <Drive color='#fff' />
          <span>{filesystem.slice(0, 1)}</span>
          <span>{percentage}%</span>
        </StyledDiskContent>
      </CircularProgressbarWithChildren>
    </StyledDiskWrapper>
  );
};

export default HardDrive;
