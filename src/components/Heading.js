import React from 'react';
import styled from 'styled-components';

const StyledHeading = styled.h1`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-content: center;
  margin: 3rem 0;
  font-size: 3rem;
  font-weight: 100;
  padding: 0 5px;
`;

const Heading = (props) => {
  return <StyledHeading {...props} />;
};

export default Heading;
