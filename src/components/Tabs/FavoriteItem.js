import React, { useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@fluentui/react/lib/Icon';
import { getFileTypeIconProps, FileIconType } from '@uifabric/file-type-icons';
import { nanoid } from 'nanoid';
import styled, { ThemeContext } from 'styled-components';
import { hexToRgba } from 'hex-and-rgba';

import { addTab } from '../../actions/tabsActions';
import { setActiveTab } from '../../actions/activeTabActions';
import { closeSearch } from '../../actions/searchActions';

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

const FavoriteItem = ({ id, name, path, isFile, ext, selected }) => {
  const themeContext = useContext(ThemeContext);
  const { fileIconSize } = themeContext.sizes;

  const selectedStore = useSelector((state) => state.selected);
  const favorites = useSelector((state) => state.favorites);
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

    console.log('Open ', path);
  };

  return (
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
  );
};

export default FavoriteItem;
