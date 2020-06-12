import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeTab, setScroll } from '../../actions/tabsActions';
import { closeSearch } from '../../actions/searchActions';
import {
  addSelectedFiles,
  clearSelectedFiles,
} from '../../actions/selectFilesActions';
import styled, { ThemeContext } from 'styled-components';
import { Icon } from '@fluentui/react/lib/Icon';

import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import NewTabContent from './NewTabContent';
import TabItem from './TabItem';

import addTabAndActivate from '../../helpers/addTabAndActivate';

import FindBox from '../FindBox';

import Path from '../Path';

import TabItemContextMenu from '../TabItemContextMenu';

const { ipcRenderer } = window.require('electron');

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
  background-color: ${({ theme }) => theme.bg.appBg};
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
  background-color: ${({ theme }) => theme.bg.appBg};
  font-size: ${({ theme }) => theme.font.pathBarFontSize};
  box-shadow: ${({ theme }) =>
    `${theme.shadows.navShadowOffsetX}px ${theme.shadows.navShadowOffsetY}px ${theme.shadows.navShadowBlur}px ${theme.shadows.navShadowSpread}px ${theme.shadows.navShadowColor}`};
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

const TabContent = ({
  id,
  name,
  content: tContent,
  createNew = false,
  path,
  scroll = false,
}) => {
  const contentRef = useRef(null);
  const gridInnerRef = useRef(null);
  const gridOuterRef = useRef(null);

  const [loadedItems, setLoadItems] = useState(100);

  const activeTab = useSelector((state) => state.activeTab);
  // const tabs = useSelector((state) => state.tabs);
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

  // Scroll remembering

  useEffect(() => {
    return () => {
      if (gridOuterRef && gridOuterRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        dispatch(setScroll(id, gridOuterRef.current.scrollTop));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // End scroll remembering

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

  // TODO: replace initialScrollTop={500} with saved value

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
          <Path path={path} />
        </StyledNav>
        <TabItemContextMenu content={content} path={path} id={id}>
          <StyledFiles>
            <StyledAutoSizer>
              {({ height, width }) => (
                <StyledRWGrid
                  initialScrollTop={scroll ? scroll : 0}
                  innerRef={gridInnerRef}
                  outerRef={gridOuterRef}
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
        </TabItemContextMenu>

        {searching ? <FindBox /> : null}
      </React.Fragment>
    </StyledTabContent>
  );
};

export default TabContent;
