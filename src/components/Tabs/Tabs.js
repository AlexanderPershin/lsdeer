import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tab from './Tab';
import PlusTab from './PlusTab';
import styled from 'styled-components';

// TODO: set active tab on delete current tab !

const TabsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  overflow-x: auto;
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
  const tabsRef = useRef(null);
  const [plusClicked, setPlusClicked] = useState(false);

  const renderTabs = () => {
    if (tabs.length === 0) return;

    return tabs.map((item, i) => <Tab key={item.id} {...item} />);
  };

  const handleScrollTabs = (e) => {
    e.stopPropagation();
    tabsRef.current.scrollLeft += e.deltaY;
  };

  useEffect(() => {
    if (plusClicked) tabsRef.current.scrollLeft = tabsRef.current.scrollWidth;
    setPlusClicked(false);
  }, [tabs]);

  return (
    <TabsContainer ref={tabsRef} onWheel={handleScrollTabs}>
      {renderTabs()}
      <PlusTab setPlusClicked={setPlusClicked} />
    </TabsContainer>
  );
};

Tabs.defaultProps = {
  list: [],
  addNewTab: () => {},
};

export default Tabs;
