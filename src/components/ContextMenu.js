import React from 'react';
import styled from 'styled-components';
import { ContextMenu as Menu } from 'react-contextmenu';

const StyledContextMenu = styled(Menu)`
  background-color: ${({ theme }) => theme.bg.contextMenuBg};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  z-index: 1000;
  box-shadow: ${({ theme }) =>
    `${theme.shadows.menuShadowOffsetX}px ${theme.shadows.menuShadowOffsetY}px ${theme.shadows.menuShadowBlur}px ${theme.shadows.menuShadowSpread}px ${theme.shadows.menuShadowColor}`};
`;

const ContextMenu = (props) => {
  return <StyledContextMenu {...props} />;
};

export default ContextMenu;
