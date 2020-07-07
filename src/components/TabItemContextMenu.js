import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { nanoid } from 'nanoid';
import styled from 'styled-components';
import ContextMenu from './ContextMenu';

import { clearSelectedFiles } from '../actions/selectFilesActions';

import openInNewTab from '../helpers/openInNewTab';
import getLinuxPath from '../helpers/getLinuxPath';

import { addToFav } from '../actions/favoritesActions';

const { ipcRenderer } = window.require('electron');

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

const StyledCtxShortcut = styled.span`
  margin-left: 1rem;
  color: #999999;
`;

const TabItemContextMenu = ({ id, path, content, children }) => {
  const activeTab = useSelector((state) => state.activeTab);
  const tabs = useSelector((state) => state.tabs);
  const selectedStore = useSelector((state) => state.selected);
  const dispatch = useDispatch();

  // Context menu handlers
  const hanldeDeselectFiles = (e) => {
    dispatch(clearSelectedFiles());
  };

  const handleOpenSelectedItem = (e) => {
    if (selectedStore.length === 1) {
      const activePath = tabs.filter((item) => item.id === activeTab)[0].path;
      const isFile = tabs
        .find((item) => item.id === activeTab)
        .content.find((item) => item.name === selectedStore[0]).isFile;
      const newPath = `${activePath}${selectedStore[0]}`;

      dispatch(clearSelectedFiles());
      ipcRenderer.send('open-directory', activeTab, newPath, isFile);
    } else {
      return;
    }
  };

  const handleContextOpenInNewTab = (e) => {
    if (selectedStore.length === 1) {
      const name = selectedStore[0];
      const activeTabObect = tabs.filter((item) => item.id === activeTab)[0];
      const tabPath = activeTabObect ? getLinuxPath(activeTabObect.path) : null;
      const isFile = content.find((item) => item.name === name).isFile;
      const pathNew = tabPath + name;
      openInNewTab(name, pathNew, isFile, dispatch);
    } else {
      return;
    }
  };

  const handleContextDelete = (e) => {
    ipcRenderer.send('delete-selected');
  };

  const handleContextOpenInExplorer = (e) => {
    ipcRenderer.send('open-selected-in-explorer');
  };

  const handleContextAddToFav = (e) => {
    const activePath = tabs.filter((item) => item.id === activeTab)[0].path;
    const newFavs = selectedStore.map((item) => {
      const contentObj = content.find((itm) => itm.name === item);

      return {
        id: nanoid(),
        name: item,
        path: `${activePath}/${item}`,
        isFile: contentObj.isFile,
        ext: contentObj.ext,
      };
    });

    dispatch(addToFav(newFavs));
  };

  const handleContextCopy = (e) => {
    ipcRenderer.send('copy-files', false);
  };

  const handleContextCut = (e) => {
    ipcRenderer.send('copy-files', true);
  };

  const handleContextPaste = (e) => {
    ipcRenderer.send('paste-files');
  };

  return (
    <React.Fragment>
      <ContextMenuTrigger id={id + path} holdToDisplay={-1}>
        {children}
      </ContextMenuTrigger>
      {selectedStore.length === 0 ? (
        <ContextMenu id={id + path}>
          <MenuItem divider />
          <StyledMenuItem onClick={handleContextPaste}>
            Paste <StyledCtxShortcut>ctrl+v</StyledCtxShortcut>
          </StyledMenuItem>
        </ContextMenu>
      ) : (
        <ContextMenu id={id + path}>
          <StyledMenuItem onClick={hanldeDeselectFiles}>
            Deselect
          </StyledMenuItem>
          {selectedStore.length === 1 && (
            <React.Fragment>
              <StyledMenuItem onClick={handleOpenSelectedItem}>
                Open
              </StyledMenuItem>
              {selectedStore[0].substr(-1, 1) === '/' && (
                <StyledMenuItem onClick={handleContextOpenInNewTab}>
                  Open in new tab
                </StyledMenuItem>
              )}
            </React.Fragment>
          )}
          <StyledMenuItem onClick={handleContextOpenInExplorer}>
            Open in explorer
          </StyledMenuItem>
          <StyledMenuItem onClick={handleContextCopy}>
            Copy <StyledCtxShortcut>ctrl+c</StyledCtxShortcut>
          </StyledMenuItem>
          <StyledMenuItem onClick={handleContextCut}>
            Cut <StyledCtxShortcut>ctrl+x</StyledCtxShortcut>
          </StyledMenuItem>
          <StyledMenuItem onClick={handleContextDelete}>
            Delete <StyledCtxShortcut>delete</StyledCtxShortcut>
          </StyledMenuItem>
          <StyledMenuItem onClick={handleContextAddToFav}>
            Add to favorites
          </StyledMenuItem>
          <MenuItem divider />
        </ContextMenu>
      )}
    </React.Fragment>
  );
};

export default TabItemContextMenu;
