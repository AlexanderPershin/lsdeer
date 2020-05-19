import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDir, addTab, closeTab } from '../../actions/tabsActions';
import {
  setSearch,
  toggleSearch,
  closeSearch,
} from '../../actions/searchActions';
import { setActiveTab } from '../../actions/activeTabActions';
import {
  addSelectedFiles,
  clearSelectedFiles,
} from '../../actions/selectFilesActions';
import styled, { ThemeContext } from 'styled-components';
import { hexToRgba } from 'hex-and-rgba';
import { nanoid } from 'nanoid';
import { Icon } from '@fluentui/react/lib/Icon';

import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

import NewTabContent from './NewTabContent';
import TabItem from './TabItem';
import deerBg from '../../img/deer.svg';

import addTabAndActivate from '../../helpers/addTabAndActivate';

import FindBox from '../FindBox';

const { remote, ipcRenderer, shell } = window.require('electron');

const StyledTabContent = styled.div`
  z-index: ${({ active }) => (active ? 100 : 50)};
  visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: ${({ theme }) => theme.sizes.navHeight} 1fr;
  grid-auto-rows: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 1rem;
    background-color: ${({ theme }) => theme.bg.activeTabBg};
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.bg.tabBg};
    border-left: 2px solid ${({ theme }) => theme.bg.activeTabBg};
    border-right: 2px solid ${({ theme }) => theme.bg.activeTabBg};
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.bg.scrollbarBg};
  }
`;

const StyledFiles = styled.div`
  width: 100%;
  height: 100%;
  display: block;
  background-color: ${({ theme }) =>
    hexToRgba(theme.bg.appBg + theme.opac.tabOpac).toString()};
  position: relative;
  overflow: hidden;
`;

const StyledNav = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.sizes.navHeight};
  border-bottom: 3px solid ${({ theme }) => theme.bg.tabBg};
  border-top: 3px solid transparent;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  background-color: ${({ theme }) =>
    hexToRgba(theme.bg.appBg + theme.opac.tabOpac).toString()};
  font-size: ${({ theme }) => theme.font.pathBarFontSize};
  box-shadow: ${({ theme }) => theme.shadows.navShadow};
  z-index: 150;
  overflow: hidden;
`;

const StyledUp = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.appColor};
  padding: 0 5px;
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.font.pathBarFontSize};
  &:hover {
    background-color: ${({ theme }) => theme.bg.selectedBg};
  }
  &:disabled {
    background-color: lightgray;
    cursor: default;
  }
`;

const StyledTabPath = styled.div`
  max-width: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  color: ${({ theme }) => theme.colors.appColor};
  border: none;
  padding: 0 1rem;
  opacity: 0.6;
  font-size: ${({ theme }) => theme.font.pathBarFontSize};
  overflow-x: auto;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    height: 0.5rem;
    background-color: ${({ theme }) => theme.bg.activeTabBg};
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.bg.tabBg};
    border: 2px solid ${({ theme }) => theme.bg.activeTabBg};
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.bg.scrollbarBg};
  }
`;

const StyledPathItem = styled.div`
  flex: 0 1 0%;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  padding: 0 0.2em;
  background-color: transparent;
  &:hover {
    background-color: ${({ theme }) => theme.bg.selectedBg};
  }
`;

const StyledPathIcon = styled(Icon)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
`;

const StyledAutoSizer = styled(AutoSizer)`
  /* margin-top: 50px; */
`;

const StyledRWGrid = styled(Grid)`
  &::-webkit-scrollbar {
    width: 1rem;
    background-color: ${({ theme }) => theme.bg.activeTabBg};
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.bg.tabBg};
    border-left: 2px solid ${({ theme }) => theme.bg.activeTabBg};
    border-right: 2px solid ${({ theme }) => theme.bg.activeTabBg};
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.bg.scrollbarBg};
  }
`;

const StyledCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const StyledContextMenu = styled(ContextMenu)`
  background-color: ${({ theme }) => theme.bg.appBg};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  z-index: 1000;
  box-shadow: ${({ theme }) => theme.shadows.menuShadow};
`;

const StyledCtxShortcut = styled.span`
  margin-left: 1rem;
  color: #999999;
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

const TabContent = ({
  id,
  name,
  content: tContent,
  createNew = false,
  path,
}) => {
  const contentRef = useRef(null);
  const pathRef = useRef(null);

  const [loadedItems, setLoadItems] = useState(100);

  const activeTab = useSelector((state) => state.activeTab);
  const tabs = useSelector((state) => state.tabs);
  const selectedStore = useSelector((state) => state.selected);
  const { searching, searchString } = useSelector((state) => state.search);
  const dispatch = useDispatch();

  const content = searching
    ? tContent.filter((item) =>
        item.name.toLowerCase().includes(searchString.toLowerCase())
      )
    : tContent;

  const themeContext = useContext(ThemeContext);
  const { rowHeight, colWidth } = themeContext.sizes;

  const handleSelect = useCallback(
    (e, selectedName) => {
      if (e.ctrlKey && selectedStore.includes(selectedName)) {
        dispatch(
          addSelectedFiles(
            selectedStore.filter((item) => item !== selectedName)
          )
        );

        return;
      } else if (e.ctrlKey && !selectedStore.includes(selectedName)) {
        dispatch(addSelectedFiles([...selectedStore, selectedName]));
        return;
      } else if (e.shiftKey && selectedStore.length > 0) {
        const elementFrom = selectedStore[selectedStore.length - 1];

        const contentIdxFrom = content.findIndex(
          (item) => item.name === elementFrom
        );
        const contentIdxTo = content.findIndex(
          (item) => item.name === selectedName
        );

        const newSelectedArr = content
          .slice(
            Math.min(contentIdxFrom, contentIdxTo),
            Math.max(contentIdxFrom, contentIdxTo)
          )
          .map((i) => i.name);

        const nextSelectedStore = [
          ...selectedStore,
          ...newSelectedArr,
          selectedName,
        ];
        const nextUniqueStore = [...new Set(nextSelectedStore)];
        dispatch(addSelectedFiles(nextUniqueStore));
        return;
      } else if (!e.ctrlKey && !selectedStore.includes(selectedName)) {
        dispatch(addSelectedFiles([selectedName]));
        return;
      } else if (
        !e.ctrlKey &&
        selectedStore.includes(selectedName) &&
        selectedStore.length === 1
      ) {
        // Only this item is selected -> do nothing
        // DON'T CHANGE THIS - VERY IMPORTANT
        // ENABLES DOUBLE CLICK EVENT TO OPEN DIRECTORY!
        return;
      } else {
        dispatch(clearSelectedFiles());
        return;
      }
    },
    [content, dispatch, selectedStore]
  );

  const handleSelectRightClick = (name) => {
    if (selectedStore.includes(name)) return;
    dispatch(addSelectedFiles([name]));
  };

  const handleGoUp = () => {
    if (path.length <= 3) {
      dispatch(closeSearch());
      addTabAndActivate(dispatch);
      dispatch(closeTab(id));
      return;
    }
    let path_arr = path.split('/');

    path_arr.splice(-2, 2);
    const newPath = path_arr.join('/') + '/';
    ipcRenderer.send('open-directory', id, newPath);
    dispatch(closeSearch());
    dispatch(clearSelectedFiles());
  };

  const handleLoadMoreOnScroll = (e) => {
    const contentEl = contentRef.current;
    try {
      if (loadedItems >= content.length) {
        return;
      }
    } catch (err) {
      console.log(err);
    }

    if (
      contentEl.scrollHeight - 150 <=
      Math.ceil(contentEl.scrollTop + contentEl.clientHeight)
    ) {
      setLoadItems((prev) => prev + 50);
    }
  };

  const handleScrollPath = (e) => {
    e.stopPropagation();
    pathRef.current.scrollLeft += e.deltaY;
  };

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

  const handleContextDelete = (e) => {
    ipcRenderer.send('delete-selected');
  };

  useEffect(() => {
    dispatch(clearSelectedFiles());
  }, [activeTab, dispatch]);

  const handlePathOpen = (pathArr) => {
    const newPath = pathArr.join('/');
    console.log('handlePathOpen -> newPath', newPath);

    dispatch(clearSelectedFiles());
    ipcRenderer.send('open-directory', activeTab, '/' + newPath + '/', false);
  };

  const renderPathNav = () => {
    const pathArr = path.split('/').filter((i) => i);
    return pathArr.map((item, idx) => {
      if (item) {
        return (
          <React.Fragment key={item}>
            <StyledPathItem
              onClick={() => handlePathOpen(pathArr.slice(0, idx + 1))}
            >
              {item}
            </StyledPathItem>
            {idx + 1 === pathArr.length ? null : (
              <StyledPathIcon
                iconName='ChevronRightMed'
                className='ms-IconExample'
              />
            )}
          </React.Fragment>
        );
      }
      return null;
    });
  };

  // TODO: make file deselection on misclick
  const calculateFlatIndex = (colIndex, rowIndex, colCount) => {
    const index = rowIndex * colCount + colIndex;
    return index;
  };

  const Cell = ({ columnIndex, rowIndex, style, data: colCount }) => {
    const item = content[calculateFlatIndex(columnIndex, rowIndex, colCount)];

    return item ? (
      <StyledCell style={style}>
        <TabItem
          {...item}
          handleSelect={handleSelect}
          handleSelectRightClick={handleSelectRightClick}
          selected={selectedStore.includes(item.name)}
        />
      </StyledCell>
    ) : null;
  };

  const calcColCount = (w) => Math.floor(w / colWidth);
  const calcRowCount = (w) => {
    const colCount = calcColCount(w);
    const rowCount = Math.ceil(content.length / colCount);
    return rowCount;
  };

  return createNew || path === '/' ? (
    <NewTabContent />
  ) : (
    <StyledTabContent
      ref={contentRef}
      active={id === activeTab}
      onScroll={handleLoadMoreOnScroll}
    >
      <React.Fragment>
        <StyledNav>
          <StyledUp onClick={handleGoUp}>
            <Icon iconName='SortUp' className='ms-IconExample' />
          </StyledUp>
          <StyledTabPath ref={pathRef} onWheel={handleScrollPath}>
            {path && renderPathNav()}
          </StyledTabPath>
        </StyledNav>
        <ContextMenuTrigger id={id + path}>
          <StyledFiles>
            <StyledAutoSizer>
              {({ height, width }) => (
                <StyledRWGrid
                  className='Grid'
                  columnCount={calcColCount(width)}
                  columnWidth={colWidth}
                  height={height}
                  rowCount={calcRowCount(width) + 1}
                  rowHeight={rowHeight}
                  width={width}
                  itemData={calcColCount(width)}
                >
                  {Cell}
                </StyledRWGrid>
              )}
            </StyledAutoSizer>
          </StyledFiles>
        </ContextMenuTrigger>
        {selectedStore.length === 0 ? (
          <StyledContextMenu id={id + path}>
            <StyledMenuItem
              data={{ foo: 'bar' }}
              onClick={() => console.log('Hello!')}
            >
              Hello
            </StyledMenuItem>
            <MenuItem divider />
          </StyledContextMenu>
        ) : (
          <StyledContextMenu id={id + path}>
            <StyledMenuItem onClick={hanldeDeselectFiles}>
              Deselect
            </StyledMenuItem>
            <StyledMenuItem onClick={handleOpenSelectedItem}>
              Open
            </StyledMenuItem>
            <StyledMenuItem onClick={handleContextDelete}>
              Delete <StyledCtxShortcut>delete</StyledCtxShortcut>
            </StyledMenuItem>
            <MenuItem divider />
          </StyledContextMenu>
        )}
        {searching ? <FindBox /> : null}
      </React.Fragment>
    </StyledTabContent>
  );
};

export default TabContent;
