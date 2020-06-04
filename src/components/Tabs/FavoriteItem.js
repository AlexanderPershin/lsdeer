import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from '@fluentui/react/lib/Icon';
import { getFileTypeIconProps, FileIconType } from '@uifabric/file-type-icons';
import { nanoid } from 'nanoid';
import styled, { ThemeContext } from 'styled-components';
import { hexToRgba } from 'hex-and-rgba';

import { MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import ContextMenu from '../ContextMenu';

import { addTab } from '../../actions/tabsActions';
import { setActiveTab } from '../../actions/activeTabActions';
import { closeSearch } from '../../actions/searchActions';
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
  padding: 5px;
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

  const dispatch = useDispatch();
  const [isSelected, setIsSelected] = useState(false);

  const truncate = (input, num) =>
    input.length > num ? `${input.substring(0, num)}...` : input;

  const handleOpenDirectory = (e) => {
    // TODO: add new tab and load path for folder
    // open in default programm for file

    if (!isFile) {
      const newId = nanoid();

      const newTab = {
        id: newId,
        name: name,
        content: [],
        createNew: true,
        path: '/',
      };

      dispatch(closeSearch());
      dispatch(addTab(newTab));
      dispatch(setActiveTab(newTab.id));
      ipcRenderer.send('open-directory', newId, path, isFile);
    } else {
      ipcRenderer.send('open-directory', 'placeholderid', path, isFile);
    }
  };

  const handleRemoveFromFav = () => {
    dispatch(removeFromFav(id));
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
            className='TabItem'
          />
          <StyledName title={name} sel={isSelected} className='TabItem'>
            {name && isSelected
              ? !isFile
                ? name.slice(0, -1)
                : name
              : truncate(!isFile ? name.slice(0, -1) : name, 20)}
          </StyledName>
        </StyledFavorite>
      </ContextMenuTrigger>
      <ContextMenu id={id}>
        <StyledMenuItem onClick={handleRemoveFromFav}>Remove</StyledMenuItem>

        <MenuItem divider />
      </ContextMenu>
    </React.Fragment>
  );
};

export default FavoriteItem;
