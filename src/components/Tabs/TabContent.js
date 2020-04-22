import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDir, addTab, closeTab } from '../../actions/tabsActions';
import { setActiveTab } from '../../actions/activeTabActions';
import styled from 'styled-components';
import { hexToRgba } from 'hex-and-rgba';
import { nanoid } from 'nanoid';
import { Icon } from '@fluentui/react/lib/Icon';

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
  height: ${({ theme }) => theme.sizes.navHeight};
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
  height: ${({ theme }) => theme.sizes.navHeight};
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

const TabContent = ({ id, name, content, createNew = false, path }) => {
  const contentRef = useRef(null);
  const [selected, setSelected] = useState([]);
  const [loadedItems, setLoadItems] = useState(100);

  const activeTab = useSelector((state) => state.activeTab);
  const dispatch = useDispatch();

  const handleSelect = (e, selectedName) => {
    // TODO: rectangle selection onMouseDown/onMouseUp select elements
    // under drawn rectangle and remove rectangle from the DOM

    if (e.ctrlKey && selected.includes(selectedName)) {
      // deselect this item
      setSelected((prev) => prev.filter((item) => item !== selectedName));
      return;
    } else if (e.ctrlKey && !selected.includes(selectedName)) {
      setSelected((prev) => [...prev, selectedName]);
      return;
    } else if (e.shiftKey && selected.length > 0) {
      const elementFrom = selected[selected.length - 1];

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

      setSelected((prev) => {
        // Need to make sure that there are only unique names in the array
        const nextSelected = [...prev, ...newSelectedArr, selectedName];
        const nextUnique = [...new Set(nextSelected)];
        return nextUnique;
      });
      return;
    } else if (!e.ctrlKey && !selected.includes(selectedName)) {
      setSelected([selectedName]);
      return;
    } else {
      setSelected([]);
      return;
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

  // TODO: create selected files reucer and actions
  // set selected array to [] on open new tab or close current or switch to another tab
  // it is needed to CRUD operations with selected files

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
            <StyledUp onClick={handleGoUp}>
              <Icon iconName='SortUp' className='ms-IconExample' />
            </StyledUp>
            <StyledTabPath value={path} onChange={() => {}} readonly />
          </StyledNav>

          {renderContent()}
        </StyledFiles>
      )}
    </StyledTabContent>
  );
};

export default TabContent;
