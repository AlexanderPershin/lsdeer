import React from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styled from 'styled-components';

const StyledDiskWrapper = styled.div`
  max-width: 10rem;
  max-height: 10rem;
  min-width: 10rem;
  min-height: 10rem;
`;

const StyledDiskContent = styled.div`
  font-size: 1.5rem;
  margin: 1rem;
`;

const HardDrive = ({ filesystem, size, used, avail, use, mounted }) => {
  const percentage = parseInt(use.replace(/%/g, ''));

  return (
    <StyledDiskWrapper>
      <CircularProgressbarWithChildren
        ressbar
        minValue={0}
        maxValue={100}
        value={percentage}
      >
        <StyledDiskContent>
          Drive {filesystem} <br />
          Used {percentage}% <br />
          Size {size} <br />
          Free {avail} <br />
          Path {mounted}
        </StyledDiskContent>
      </CircularProgressbarWithChildren>
    </StyledDiskWrapper>
  );
};

export default HardDrive;
