import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@fluentui/react/lib/Icon';
import { getFileTypeIconProps, FileIconType } from '@uifabric/file-type-icons';
import styled, { ThemeContext } from 'styled-components';
import { hexToRgba } from 'hex-and-rgba';

import { MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import ContextMenu from '../ContextMenu';

import openInNewTab from '../../helpers/openInNewTab';

import { removeFromFav } from '../../actions/favoritesActions';

const { ipcRenderer } = window.require('electron');

const StyledFavorite = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  background-color: transparent;
  border: none;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  outline: none;
  position: relative;
  z-index: ${({ sel }) => (sel ? 100 : 'initial')};
  &:active {
    background-color: ${({ theme, sel }) =>
      hexToRgba(theme.bg.selectedBg + 'cc').toString()};
  }
  &:focus {
    background-color: ${({ theme }) => theme.bg.selectedBg};
  }
  -webkit-user-drag: none;
  & > i > img {
    -webkit-user-drag: none;
  }
`;

const StyledName = styled.span`
  width: 100px;
  white-space: normal;
  word-wrap: break-word;
  text-align: center;
  z-index: ${({ sel }) => (sel ? 100 : 'initial')};
`;

const StyledMenuItem = styled(MenuItem)`
  padding: 2px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  &:hover {
    background-color: ${({ theme }) => theme.bg.selectedBg};
  }
`;

const FavoriteItem = ({ id, name, path, isFile, ext, selected }) => {
  const themeContext = useContext(ThemeContext);
  const { fileIconSize } = themeContext.sizes;

  const activeTab = useSelector((state) => state.activeTab);
  const dispatch = useDispatch();
  const [isSelected, setIsSelected] = useState(false);

  const truncate = (input, num) =>
    input.length > num ? `${input.substring(0, num)}...` : input;

  const handleOpenDirectory = (e) => {
    ipcRenderer.send('open-directory', activeTab, path, isFile);
  };

  const handleOpenInNewTab = () => {
    openInNewTab(name, path, isFile, dispatch);
  };

  const handleRemoveFromFav = () => {
    dispatch(removeFromFav(id));
  };

  const handleOpenInExplorer = (e) => {
    ipcRenderer.send('open-in-expolorer', path);
  };

  return (
    <React.Fragment>
      <ContextMenuTrigger id={id} holdToDisplay={-1}>
        <StyledFavorite
          onFocus={() => setIsSelected(true)}
          onBlur={() => setIsSelected(false)}
          onDoubleClick={handleOpenDirectory}
        >
          <Icon
            {...getFileTypeIconProps({
              type: isFile && ext ? '' : FileIconType.folder,
              extension: isFile && ext ? ext : '',
              size: fileIconSize,
              imageFileType: 'svg',
            })}
            className="TabItem"
          />
          <StyledName title={name} sel={isSelected} className="TabItem">
            {name && isSelected ? name : truncate(name, 20)}
          </StyledName>
        </StyledFavorite>
      </ContextMenuTrigger>
      <ContextMenu id={id} holdToDisplay={-1}>
        <StyledMenuItem onClick={handleOpenDirectory}>Open</StyledMenuItem>
        <StyledMenuItem onClick={handleOpenInNewTab}>
          Open in new tab
        </StyledMenuItem>
        <StyledMenuItem onClick={handleOpenInExplorer}>
          Open in Explorer
        </StyledMenuItem>
        <StyledMenuItem onClick={handleRemoveFromFav}>
          Remove from favorites
        </StyledMenuItem>

        <MenuItem divider />
      </ContextMenu>
    </React.Fragment>
  );
};

export default FavoriteItem;
