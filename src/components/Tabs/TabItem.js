import React, { useCallback, useState, useContext, useRef } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedFiles } from '../../actions/selectFilesActions';
import imageExtensions from '../../image_ext.json';

// fluentui
import { Icon } from '@fluentui/react/lib/Icon';
import { getFileTypeIconProps, FileIconType } from '@uifabric/file-type-icons';

const { ipcRenderer } = window.require('electron');
// const mainProcess = remote.require('./index.js');

const StyledItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ theme, sel }) =>
    sel ? theme.bg.selectedBg : 'transparent'};
  z-index: ${({ sel }) => (sel ? 10 : 5)};
  user-select: none;
  cursor: pointer;
  position: relative;
  padding: 5px;
  border: none;
  outline: none;
  color: inherit;
  font-size: inherit;
  font-family: inherit;
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
`;

const StyledImg = styled.img`
  width: ${({ theme, iconSize }) => (iconSize ? `${iconSize}px` : '100%')};
  height: ${({ theme, iconSize }) => (iconSize ? `${iconSize}px` : '100px')};
  object-fit: contain;
  -webkit-user-drag: none;
`;

const truncate = (input, num) =>
  input.length > num ? `${input.substring(0, num)}...` : input;

const TabItem = ({
  name,
  path,
  isFile,
  ext,
  selected,
  handleSelect,
  handleSelectRightClick,
}) => {
  const activeTab = useSelector((state) => state.activeTab);
  const tabs = useSelector((state) => state.tabs);
  const selectedStore = useSelector((state) => state.selected);
  const dispatch = useDispatch();

  const [imageIsBroken, setImageIsBroken] = useState(false);

  const thisItem = useRef(null);

  const themeContext = useContext(ThemeContext);
  const { fileIconSize } = themeContext.sizes;

  const handleOpenDirectory = (e) => {
    const activePath = tabs.filter((item) => item.id === activeTab)[0].path;
    const newPath = `${activePath}${name}`;

    dispatch(clearSelectedFiles());
    ipcRenderer.send('open-directory', activeTab, newPath, isFile);
  };

  const handleSelectThis = useCallback((e) => handleSelect(e, name), [
    handleSelect,
    name,
  ]);

  const handleSelectContext = (e) => {
    handleSelectRightClick(name);
  };

  const addDefaultSrc = useCallback((e) => {
    setImageIsBroken(true);
  }, []);

  // TODO: Exclude .psd and other unsupported by 'image-thumbnail' lib image extensioins!!!
  return (
    <StyledItem
      onClick={handleSelectThis}
      onContextMenu={handleSelectContext}
      onDoubleClick={handleOpenDirectory}
      sel={selected}
      ref={thisItem}
      className='TabItem'
    >
      {!imageIsBroken && isFile && imageExtensions.includes(ext.substr(1)) ? (
        <StyledImg
          src={`http://localhost:15032/file/${encodeURIComponent(path)}`}
          alt={name}
          onError={addDefaultSrc}
          iconSize={
            themeContext.sizes.fileIconSize < 96
              ? themeContext.sizes.fileIconSize
              : false
          }
        />
      ) : (
        <Icon
          {...getFileTypeIconProps({
            type: isFile && ext ? '' : FileIconType.folder,
            extension: isFile && ext ? ext : '',
            size: fileIconSize,
            imageFileType: 'svg',
          })}
          className='TabItem'
        />
      )}
      <StyledName title={name} sel={selected} className='TabItem'>
        {name && selected && selectedStore.length === 1
          ? !isFile
            ? name.slice(0, -1)
            : name
          : truncate(!isFile ? name.slice(0, -1) : name, 20)}
      </StyledName>
    </StyledItem>
  );
};

TabItem.defaultProps = {
  name: 'Default',
  path: '/',
  isFile: false,
  ext: null,
  selected: false,
  handleSelect: () => {},
  handleSelectRightClick: () => {},
};

export default TabItem;
