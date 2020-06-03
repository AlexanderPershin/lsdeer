import React from 'react';
import styled from 'styled-components';

const StyledBtn = styled.button`
  color: inherit;
  padding: 5px 15px;
  border: none;
  background-color: ${({ theme }) => theme.bg.appBarBg};
  &:hover {
    background-color: ${({ theme }) => theme.bg.selectedBg};
    cursor: pointer;
  }
  &:focus {
    outline: ${({ theme }) =>
      `${theme.sizes.focusOutlineWidth} solid ${theme.bg.selectedBg}`};
  }
`;

const Button = (props) => {
  return <StyledBtn {...props} />;
};

export default Button;
