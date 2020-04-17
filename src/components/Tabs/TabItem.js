import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { openDir } from '../../actions/tabsActions';
import { hexToRgba } from 'hex-and-rgba';
import FileIcon, { defaultStyles } from 'react-file-icon';

// fluentui
import { Icon } from '@fluentui/react/lib/Icon';
import { getFileTypeIconProps, FileIconType } from '@uifabric/file-type-icons';

const { remote, ipcRenderer, shell } = window.require('electron');
const mainProcess = remote.require('./index.js');

const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme, sel }) =>
    sel ? hexToRgba(theme.bg.selectedBg + 'cc').toString() : 'transparent'};
  z-index: ${({ sel }) => (sel ? 10 : 5)};
  user-select: none;
  cursor: pointer;
  width: 100%;
  position: relative;
  padding: 5px;
`;

const StyledName = styled.div`
  background-color: ${({ theme, sel }) =>
    sel ? hexToRgba(theme.bg.selectedBg + 'cc').toString() : 'transparent'};
  width: 100%;
  word-wrap: break-word;
  text-align: center;
`;

const truncate = (input, num) =>
  input.length > num ? `${input.substring(0, num)}...` : input;

const TabItem = ({ name, path, isFile, ext, selected, handleSelect }) => {
  const activeTab = useSelector((state) => state.activeTab);
  const tabs = useSelector((state) => state.tabs);
  const dispatch = useDispatch();

  const handleOpenDirectory = () => {
    const activePath = tabs.filter((item) => item.id === activeTab)[0].path;
    const newPath = `${activePath}/${name}`;

    dispatch(openDir(activeTab, newPath));
  };

  // TODO: jpg image preview
  return (
    <StyledItem
      onClick={() => handleSelect(name)}
      onDoubleClick={handleOpenDirectory}
      sel={selected === name}
    >
      <Icon
        {...getFileTypeIconProps({
          type: ext ? '' : FileIconType.folder,
          extension: ext,
          size: 48,
          imageFileType: 'svg',
        })}
      />
      <StyledName title={name} sel={selected === name}>
        {truncate(name, 20)}
      </StyledName>
    </StyledItem>
  );
};

export default TabItem;
//  <FileIcon
//         fold={true}
//         type='image'
//         size={72}
//         extension={ext ? ext : 'folder'}
//         {...defaultStyles[ext]}
//       />
