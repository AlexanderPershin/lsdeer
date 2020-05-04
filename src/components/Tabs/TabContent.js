import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDir, addTab, closeTab } from '../../actions/tabsActions';
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

import NewTabContent from './NewTabContent';
import TabItem from './TabItem';
import deerBg from '../../img/deer.svg';

import addTabAndActivate from '../../helpers/addTabAndActivate';

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
  overflow-y: auto;
  background: url(${deerBg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
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

// TODO: Add margin to grid or empty row on the top for the nav element

const StyledNav = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.sizes.navHeight};
  border-bottom: 3px solid ${({ theme }) => theme.bg.tabBg};
  border-top: 3px solid ${({ theme }) => theme.bg.tabBg};
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  font-size: ${({ theme }) => theme.font.pathBarFontSize};
  z-index: 150;
`;

const StyledUp = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: darkgreen;
  color: ${({ theme }) => theme.colors.appColor};
  padding: 0 5px;
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.font.pathBarFontSize};
  &:focus {
    outline: ${({ theme }) => theme.bg.selectedBg} solid
      ${({ theme }) => theme.sizes.focusOutlineWidth};
  }
  &:disabled {
    background-color: lightgray;
    cursor: default;
  }
`;

const StyledTabPath = styled.input`
  flex-grow: 1;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.bg.pathBarBg};
  color: ${({ theme }) => theme.colors.appColor};
  border: none;
  padding: 0 1rem;
  opacity: 0.6;
  font-size: ${({ theme }) => theme.font.pathBarFontSize};
  &:focus {
    opacity: 1;
    outline: ${({ theme }) => theme.bg.selectedBg} solid
      ${({ theme }) => theme.sizes.focusOutlineWidth};
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

const TabContent = ({ id, name, content, createNew = false, path }) => {
  const contentRef = useRef(null);

  const [loadedItems, setLoadItems] = useState(100);

  const activeTab = useSelector((state) => state.activeTab);
  const selectedStore = useSelector((state) => state.selected);
  const dispatch = useDispatch();

  const themeContext = useContext(ThemeContext);
  const { rowHeight, colWidth } = themeContext.sizes;

  // Optimize handleSelect with useCallback hook

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

  const handleGoUp = () => {
    if (path.length <= 3) {
      addTabAndActivate(dispatch);
      dispatch(closeTab(id));
      return;
    }
    let path_arr = path.split('/');

    path_arr.splice(-2, 2);
    const newPath = path_arr.join('/') + '/';
    dispatch(openDir(id, newPath));

    const timer = setTimeout(() => {
      dispatch(clearSelectedFiles());
      clearTimeout(timer);
    }, [100]);
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

  useEffect(() => {
    dispatch(clearSelectedFiles());
  }, [activeTab, dispatch]);

  useEffect(() => {
    ipcRenderer.on('select-all', (event, data) => {
      const contentNames = content.map((i) => i.name);

      dispatch(addSelectedFiles(contentNames));
    });
  }, [content, dispatch, selectedStore]);

  useEffect(() => {
    ipcRenderer.on('copy-to-clipboard', (event, data) => {
      ipcRenderer.send('copied-file', path, selectedStore);
    });

    ipcRenderer.on('paste-from-clipboard', (event, data) => {
      ipcRenderer.send('pasted-file', path);
    });

    ipcRenderer.on('edit-action-complete', (event, data) => {
      dispatch(openDir(id, path));
    });

    return () => {
      ipcRenderer.removeAllListeners();
    };
  }, [path, selectedStore]);

  // TODO: create selected files reucer and actions
  // set selected array to [] on open new tab or close current or switch to another tab
  // it is needed to CRUD operations with selected files

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

  return (
    <StyledTabContent
      ref={contentRef}
      active={id === activeTab}
      onScroll={handleLoadMoreOnScroll}
    >
      {createNew ? (
        <NewTabContent />
      ) : (
        <React.Fragment>
          <StyledNav>
            <StyledUp onClick={handleGoUp}>
              <Icon iconName='SortUp' className='ms-IconExample' />
            </StyledUp>
            <StyledTabPath value={path} onChange={() => {}} readonly />
          </StyledNav>
          <StyledFiles>
            <StyledAutoSizer>
              {({ height, width }) => (
                <StyledRWGrid
                  className='Grid'
                  columnCount={calcColCount(width)}
                  columnWidth={colWidth}
                  height={height}
                  rowCount={calcRowCount(width)}
                  rowHeight={rowHeight}
                  width={width}
                  itemData={calcColCount(width)}
                >
                  {Cell}
                </StyledRWGrid>
              )}
            </StyledAutoSizer>
          </StyledFiles>
        </React.Fragment>
      )}
    </StyledTabContent>
  );
};

export default TabContent;
