import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDir, addTab, closeTab } from '../../actions/tabsActions';
import { setActiveTab } from '../../actions/activeTabActions';
import styled from 'styled-components';
import { hexToRgba } from 'hex-and-rgba';
import { nanoid } from 'nanoid';

import NewTabContent from './NewTabContent';
import TabItem from './TabItem';
import deerBg from '../../img/deer.svg';

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
  grid-template-rows: 1fr;
  grid-gap: 20px;
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, min-content));
  grid-auto-rows: min-content;
  grid-gap: 20px;
  align-items: start;
  justify-items: center;
  background-color: ${({ theme }) =>
    hexToRgba(theme.bg.appBg + theme.opac.tabOpac).toString()};
`;

// TODO: Add margin to grid or empty row on the top for the nav element

const StyledNav = styled.div`
  width: 100%;
  height: 50px;
  position: fixed;
  border-bottom: 3px solid ${({ theme }) => theme.bg.tabBg};
  border-top: 3px solid ${({ theme }) => theme.bg.tabBg};
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  font-size: ${({ theme }) => theme.font.pathBarFontSize};
  z-index: 150;
`;

const StyledNavPlaceholder = styled.div`
  align-self: stretch;
  justify-self: stretch;
  grid-column: 1 / -1;
  height: 50px;
`;

const StyledUp = styled.button`
  border: none;
  background-color: darkgreen;
  color: ${({ theme }) => theme.colors.appColor};
  padding: 10px 20px;
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.font.pathBarFontSize};
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
  font-size: ${({ theme }) => theme.font.pathBarFontSize};
  &:focus {
    outline: ${({ theme }) => theme.bg.selectedBg} solid 2px;
  }
  opacity: 0.6;
`;

const TabContent = ({ id, name, content, createNew = false, path }) => {
  const contentRef = useRef(null);
  const [selected, setSelected] = useState([]);
  const [loadedItems, setLoadItems] = useState(100);

  const activeTab = useSelector((state) => state.activeTab);
  const dispatch = useDispatch();

  const handleSelect = (e, name) => {
    // check if ctrl or shift pressed

    if (e.ctrlKey && selected.includes(name)) {
      // deselect this item
      setSelected((prev) => prev.filter((item) => item !== name));
      return;
    } else if (e.ctrlKey && !selected.includes(name)) {
      setSelected((prev) => [...prev, name]);
    } else if (!e.ctrlKey && !selected.includes(name)) {
      setSelected([name]);
    } else {
      setSelected([]);
    }
  };

  const addTabAndActivate = () => {
    const newTab = {
      id: nanoid(),
      name: 'New',
      content: [],
      createNew: true,
      path: '/',
    };
    dispatch(addTab(newTab));
    dispatch(setActiveTab(newTab.id));
    dispatch(closeTab(id));
  };

  const handleGoUp = () => {
    if (path.length <= 2) {
      addTabAndActivate();
      return;
    }
    let path_arr = path.split('/');

    path_arr.splice(-2, 2);
    const newPath = path_arr.join('/') + '/';
    dispatch(openDir(id, newPath));
  };

  // TODO: optimize performance for huge folders with more than 1000 elements
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
      console.log('Scrolled bottom');
      setLoadItems((prev) => prev + 50);
    }
  };

  const renderContent = () => {
    return content
      .slice(0, loadedItems)
      .map((item, i) => (
        <TabItem
          key={`${item.name} ${i}`}
          {...item}
          selected={selected.includes(item.name)}
          handleSelect={handleSelect}
        />
      ));
  };

  return (
    <StyledTabContent
      ref={contentRef}
      active={id === activeTab}
      onScroll={handleLoadMoreOnScroll}
    >
      {createNew || path === '/' ? (
        <NewTabContent />
      ) : (
        <StyledFiles>
          <StyledNavPlaceholder />
          <StyledNav>
            <StyledUp onClick={handleGoUp}>Up</StyledUp>
            <StyledTabPath value={path} onChange={() => {}} readonly />
          </StyledNav>

          {renderContent()}
        </StyledFiles>
      )}
    </StyledTabContent>
  );
};

export default TabContent;
