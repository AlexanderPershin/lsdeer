import React from 'react';
import styled from 'styled-components';

const StyledDrive = styled.svg`
  height: 3rem;
  width: 3rem;
`;

const Drive = ({ color }) => {
  return (
    <StyledDrive
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 16 16'
    >
      <g fill='none' fillRule='evenodd' stroke='none' strokeWidth='1'>
        <g fill={color} transform='translate(-576 -96)'>
          <path d='M579 99a2 2 0 012-2h6a2 2 0 012 2l.976 8.78a1.008 1.008 0 00-.978-.78h-9.996a.998.998 0 00-1.002.999V108h-.015zm.496 9c-.826 0-1.496.666-1.496 1.5 0 .828.68 1.5 1.496 1.5h9.008c.826 0 1.496-.666 1.496-1.5 0-.828-.68-1.5-1.496-1.5h-9.008zm7.504 1v1h1v-1h-1zm0 0'></path>
        </g>
      </g>
    </StyledDrive>
  );
};

export default Drive;
