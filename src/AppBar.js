import React from 'react';
import { useSelector } from 'react-redux';
import 'electronbar/lib/electronbar.css';
import styled from 'styled-components';

const StyledElectronBar = styled.div`
  display: ${({ hideInterface }) => hideInterface && 'none'};
  .electronbar {
    background-color: ${({ theme }) => theme.bg.appBarBg};
    font-size: ${({ theme }) => theme.font.appBarFontSize};
  }
  .electronbar-favicon {
    background-color: transparent;
  }
  .electronbar::before {
    content: '';
    -webkit-app-region: no-drag;
    position: absolute;
    top: 0;
    width: 100%;
    height: 20%;
  }
  .electronbar-title {
    color: ${({ theme }) => theme.colors.appTitleColor};
    text-align: center;
  }
  .electronbar-top-menu-item {
    color: ${({ theme }) => theme.colors.appColor};
  }
  .electronbar-menu-item {
    color: ${({ theme }) => theme.colors.appColor};
  }
  .electronbar-top-menu-item-children {
    padding: 0;
    background-color: ${({ theme }) => theme.bg.contextMenuBg};
  }
  .electronbar-top-menu-item-children,
  .electronbar-menu-item-children {
    box-shadow: ${({ theme }) =>
      `${theme.shadows.menuShadowOffsetX}px ${theme.shadows.menuShadowOffsetY}px ${theme.shadows.menuShadowBlur}px ${theme.shadows.menuShadowSpread}px ${theme.shadows.menuShadowColor}`} !important;
  }
  .electronbar-menu-item-label {
    padding: 0 15px;
  }
  .electronbar-menu-item-label-text {
    font-size: ${({ theme }) => theme.font.appBarMenuFontSize};
  }
  .electronbar-menu-item-label-accelerator {
    font-size: ${({ theme }) => theme.font.appBarMenuFontSize};
  }
  .electronbar-top-menu-item.open,
  .electronbar-menu-item.open {
    background-color: ${({ theme }) => theme.bg.appBarActiveItemBg};
  }
  .electronbar-top-menu-item:not(.disabled):hover,
  .electronbar-menu-item:not(.disabled):hover {
    background-color: ${({ theme }) => theme.bg.selectedBg};
  }
  .electronbar-button {
    font-size: 0.7rem;
  }
  .electronbar-icon-minimize,
  .electronbar-icon-maximize,
  .electronbar-icon-unfullscreen,
  .electronbar-icon-close {
    font-size: 0.5rem;
  }
  .electronbar-button-minimize,
  .electronbar-button-maximize,
  .electronbar-button-unfullscreen,
  .electronbar-button-close {
    padding: 0 1.1rem;
  }
  .electronbar-button-minimize:hover,
  .electronbar-button-maximize:hover,
  .electronbar-button-unfullscreen:hover {
    background-color: ${({ theme }) => theme.bg.activeTabBg};
  }
  .electronbar-button-close:hover {
    background-color: ${({ theme }) => theme.bg.appBarXBtnHover};
  }
`;

const AppBar = ({ electronbarMount }) => {
  const hideInterface = useSelector((state) => state.hideInterface);

  return (
    <StyledElectronBar hideInterface={hideInterface}>
      <div ref={electronbarMount} />
    </StyledElectronBar>
  );
};

export default AppBar;
