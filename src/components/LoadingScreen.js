import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { CubeGrid } from 'styled-spinkit';

const StyledLoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.bg.loadingBg};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingScreen = () => {
  const themeContext = useContext(ThemeContext);

  return (
    <StyledLoadingWrapper>
      <CubeGrid color={themeContext.bg.accentBg} size={150} />
    </StyledLoadingWrapper>
  );
};

export default LoadingScreen;
