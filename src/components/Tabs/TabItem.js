import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  useRef,
} from 'react';
import styled, { ThemeContext } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { openDir } from '../../actions/tabsActions';
import { clearSelectedFiles } from '../../actions/selectFilesActions';
import { hexToRgba } from 'hex-and-rgba';
import imageExtensions from 'image-extensions';

// fluentui
import { Icon } from '@fluentui/react/lib/Icon';
import { getFileTypeIconProps, FileIconType } from '@uifabric/file-type-icons';

const { remote, ipcRenderer, shell } = window.require('electron');
// const mainProcess = remote.require('./index.js');

const StyledItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ theme, sel }) =>
    sel ? hexToRgba(theme.bg.selectedBg + 'cc').toString() : 'transparent'};
  z-index: ${({ sel }) => (sel ? 10 : 5)};
  user-select: none;
  cursor: pointer;
  position: relative;
  padding: 5px;
  border: none;
  outline: none;
  color: inherit;
  font-size: inherit;
  /* &:active,
  &:focus {
    background-color: ${({ theme }) => theme.bg.selectedBg};
  } */
  &:not(:focus) {
    /* background-color: transparent; */
  }
`;

const StyledName = styled.span`
  width: 100px;
  white-space: normal;
  word-wrap: break-word;
  text-align: center;
`;

const StyledImg = styled.img`
  width: 100%;
  height: 100px;
  object-fit: contain;
`;

const truncate = (input, num) =>
  input.length > num ? `${input.substring(0, num)}...` : input;

const TabItem = ({ name, path, isFile, ext, selected, handleSelect }) => {
  const activeTab = useSelector((state) => state.activeTab);
  const tabs = useSelector((state) => state.tabs);
  const selectedStore = useSelector((state) => state.selected);
  const dispatch = useDispatch();

  const [imageIsBroken, setImageIsBroken] = useState(false);

  const thisItem = useRef(null);

  const themeContext = useContext(ThemeContext);
  const { fileIconSize } = themeContext.sizes;

  const handleOpenDirectory = (e) => {
    console.log('TabItem openDirectory');

    const activePath = tabs.filter((item) => item.id === activeTab)[0].path;
    const newPath = `${activePath}${name}`;

    // dispatch(openDir(activeTab, newPath));
    dispatch(clearSelectedFiles());
    ipcRenderer.send('open-directory', activeTab, newPath);
  };

  const handleSelectThis = useCallback((e) => handleSelect(e, name), [
    handleSelect,
    name,
  ]);

  const addDefaultSrc = useCallback((e) => {
    setImageIsBroken(true);
  }, []);

  // TODO: Exclude .psd and other unsupported by 'image-thumbnail' lib image extensioins!!!
  return (
    <StyledItem
      onClick={handleSelectThis}
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

export default TabItem;
