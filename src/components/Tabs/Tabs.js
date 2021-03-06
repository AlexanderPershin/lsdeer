import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tab from './Tab';
import PlusTab from './PlusTab';
import styled from 'styled-components';

import { setTabs } from '../../actions/tabsActions';
import { clearSelectedFiles } from '../../actions/selectFilesActions';

const TabsContainer = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  overflow-x: auto;
  background-color: ${({ theme }) => theme.bg.appBg};
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

const Tabs = () => {
  const tabs = useSelector((state) => state.tabs);
  const activeTab = useSelector((state) => state.activeTab);
  const dispatch = useDispatch();
  const tabsRef = useRef(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const renderTabs = () => {
    if (tabs.length === 0) return;

    return tabs.map((item, i) => (
      <Tab
        key={item.id}
        {...item}
        handleDragStart={handleDragStart}
        handleDragEnd={handleDragEnd}
        handleDragOver={handleDragOver}
        dragOverIndex={dragOverItem}
      />
    ));
  };

  const handleScrollTabs = (e) => {
    e.stopPropagation();
    tabsRef.current.scrollLeft += e.deltaY;
  };

  const handleDragStart = (e, id) => {
    const draggedIndex = tabs.findIndex((item) => item.id === id);
    setDraggedItem(draggedIndex);
  };

  const handleDragEnd = (e, id) => {
    try {
      if (draggedItem === dragOverItem || tabs[dragOverItem].isLocked) {
        setDragOverItem(null);
        setDraggedItem(null);
        return;
      }
    } catch (err) {
      // error
    }

    const reorderedTabs = [...tabs];
    // copy movable
    const movedTab = reorderedTabs[draggedItem];
    // delete movable
    reorderedTabs.splice(draggedItem, 1);
    // paste movable after overItem
    reorderedTabs.splice(dragOverItem, 0, movedTab);

    dispatch(setTabs(reorderedTabs));
    setDragOverItem(null);
    setDraggedItem(null);
  };

  const handleDragOver = (e, id) => {
    const overIndex = tabs.findIndex((item) => item.id === id);
    setDragOverItem(overIndex);
  };

  useEffect(() => {
    const currentTabIdx = tabs.findIndex((i) => i.id === activeTab);

    if (currentTabIdx === tabs.length - 1) {
      tabsRef.current.scrollLeft = tabsRef.current.scrollWidth;
    }
  }, [tabs, activeTab]);

  useEffect(() => {
    dispatch(clearSelectedFiles());
  }, [activeTab, dispatch]);

  return (
    <TabsContainer ref={tabsRef} onWheel={handleScrollTabs}>
      {renderTabs()}
      {tabs.length === 0 ? null : <PlusTab />}
    </TabsContainer>
  );
};

Tabs.defaultProps = {
  list: [],
  addNewTab: () => {},
};

export default Tabs;
