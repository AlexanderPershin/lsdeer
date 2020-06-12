import React, { useState, useEffect, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setScroll } from '../../actions/tabsActions';

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
  const gridInnerRef = useRef(null);
  const gridOuterRef = useRef(null);

  const activeTab = useSelector((state) => state.activeTab);
  const { searching, searchString } = useSelector((state) => state.search);
  const dispatch = useDispatch();

  const content = searching
    ? tContent.filter((item) =>
        item.name.toLowerCase().includes(searchString.toLowerCase())
      )
    : tContent;

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
      // onScroll={handleLoadMoreOnScroll}
    >
      <React.Fragment>
        <StyledNav>
          <UpBtn id={id} path={path} />
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
