import React, { useState, useEffect, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setScroll } from '../../actions/tabsActions';
import { addSelectedFiles } from '../../actions/selectFilesActions';
import { setCursor } from '../../actions/cursorActions';

import styled, { ThemeContext } from 'styled-components';

import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import NewTabContent from './NewTabContent';

import Cell from './Cell';

import FindBox from '../FindBox';

import Path from '../Path';
import UpBtn from '../UpBtn';

import TabItemContextMenu from '../TabItemContextMenu';

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

const TabContent = ({
  id,
  name,
  content: tContent,
  createNew = false,
  path,
  scroll = 0,
}) => {
  const contentRef = useRef(null);
  const gridRef = useRef(null);
  const gridInnerRef = useRef(null);
  const gridOuterRef = useRef(null);

  const activeTab = useSelector((state) => state.activeTab);
  const cursor = useSelector((state) => state.cursor);
  const { searching, searchString } = useSelector((state) => state.search);
  const dispatch = useDispatch();

  const [cursorTouched, setCursorTouched] = useState(false);
  const [currentColCount, setCurrentColCount] = useState(1);

  const content = tContent;

  const themeContext = useContext(ThemeContext);
  const { rowHeight, colWidth } = themeContext.sizes;

  useEffect(() => {
    return () => {
      if (gridOuterRef && gridOuterRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        dispatch(setScroll(id, gridOuterRef.current.scrollTop));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (content.length > 0 && cursorTouched) {
      dispatch(addSelectedFiles([content[cursor].name]));
    }
  }, [content, cursor, cursorTouched, dispatch]);

  useEffect(() => {
    dispatch(setCursor(0));
  }, [activeTab, dispatch]);

  useEffect(() => {
    const currentRowCount = Math.ceil(content.length / currentColCount);
    const cursorRowPos = Math.ceil(cursor / currentColCount);
    const prevItemsCount = (cursorRowPos - 1) * currentColCount;
    const cursorColPos =
      prevItemsCount > 0 ? Math.floor(cursor % prevItemsCount) : cursor;

    const calculateNextRow = (nextCursor, up) => {
      return up
        ? Math.floor(nextCursor / currentColCount)
        : Math.ceil(nextCursor / currentColCount);
    };

    const handleCursor = (e) => {
      if (!'37 38 39 40'.includes(e.which)) return;
      if (searching) return;
      setCursorTouched(true);

      // Arrows pressed 37,38,39,40
      // Left/Right
      if (e.which === 37) {
        let nextCursor;
        if (cursor === 0) {
          nextCursor = content.length - 1;
        } else {
          nextCursor = cursor - 1;
        }
        gridRef.current.scrollToItem({
          columnIndex: cursorColPos,
          rowIndex: calculateNextRow(nextCursor, true),
        });
        dispatch(setCursor(nextCursor));
      } else if (e.which === 39) {
        let nextCursor;
        if (cursor === content.length - 1) {
          nextCursor = 0;
        } else {
          nextCursor = cursor + 1;
        }
        gridRef.current.scrollToItem({
          columnIndex: cursorColPos,
          rowIndex: calculateNextRow(nextCursor, false),
        });
        dispatch(setCursor(nextCursor));
      }

      // TODO: calculate flat index and next cursor position using currentColcount and colWidth from themeContext
      // Add ctrl pressed state and if pressed add to selected files not rewrite them
      // Up/Down
      if (e.which === 38) {
        // up
        let nextCursor;
        if (cursor - currentColCount >= 0) {
          nextCursor = cursor - currentColCount;
        } else {
          nextCursor = cursorColPos;
        }
        gridRef.current.scrollToItem({
          columnIndex: cursorColPos,
          rowIndex: calculateNextRow(nextCursor, true),
        });
        dispatch(setCursor(nextCursor));
      } else if (e.which === 40) {
        // down
        let nextCursor;
        if (cursor + currentColCount < content.length - 1) {
          nextCursor = cursor + currentColCount;
        } else if (cursorRowPos === currentRowCount) {
          return;
        } else {
          nextCursor = content.length - 1;
        }

        gridRef.current.scrollToItem({
          columnIndex: cursorColPos,
          rowIndex: calculateNextRow(nextCursor, false),
        });
        dispatch(setCursor(nextCursor));
      }
    };

    window.addEventListener('keydown', handleCursor);

    return () => {
      window.removeEventListener('keydown', handleCursor);
    };
  }, [cursor, content, dispatch, currentColCount, gridRef, searching]);

  useEffect(() => {
    if (searching && searchString.trim() !== '') {
      let itemIndex;
      const searchResults = content.filter((item, index) => {
        const incl = item.name
          .toLowerCase()
          .includes(searchString.toLowerCase());
        if (incl) {
          if (!itemIndex) itemIndex = index;
          return true;
        }
        return false;
      });
      if (searchResults.length > 0) {
        const namesArr = searchResults.map((item) => item.name);
        gridRef.current.scrollToItem({
          columnIndex: 0,
          rowIndex: Math.round(itemIndex / currentColCount),
        });
        dispatch(addSelectedFiles(namesArr));
      }
    }
  }, [searching, searchString, content, dispatch, currentColCount]);

  const handleResize = ({ width, height }) => {
    setCurrentColCount(Math.floor(width / colWidth));
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
    <StyledTabContent ref={contentRef} active={id === activeTab}>
      <React.Fragment>
        <StyledNav>
          <UpBtn id={id} path={path} />
          <Path path={path} />
        </StyledNav>
        <TabItemContextMenu content={content} path={path} id={id}>
          <StyledFiles>
            <StyledAutoSizer onResize={handleResize}>
              {({ height, width }) => (
                <StyledRWGrid
                  initialScrollTop={scroll ? scroll : 0}
                  ref={gridRef}
                  innerRef={gridInnerRef}
                  outerRef={gridOuterRef}
                  className="Grid"
                  columnCount={calcColCount(width)}
                  columnWidth={colWidth}
                  height={height}
                  rowCount={calcRowCount(width) + 1}
                  rowHeight={rowHeight}
                  width={width}
                  itemData={{ colCount: calcColCount(width), content }}
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
