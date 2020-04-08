import React, { useState } from 'react';
import Tab from './Tab';
import styled from 'styled-components';

const TabsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
`;

const Tabs = ({ list, addNewTab, active, setActive, closeTab }) => {
  const renderTabs = () => {
    if (list.length === 0) return;

    return list.map((item, i) => (
      <Tab
        key={item.id}
        {...item}
        active={active}
        setActiveTab={setActive}
        closeTab={closeTab}
      />
    ));
  };

  const addNewTabAndActivate = () => {
    addNewTab();
  };

  const PlusTab = () => (
    <Tab key='plus_tab' name='+' id='plus_tab' onClick={addNewTabAndActivate} />
  );

  return (
    <TabsContainer>
      {renderTabs()}
      <PlusTab />
    </TabsContainer>
  );
};

Tabs.defaultProps = {
  list: [],
  addNewTab: () => {},
};

export default Tabs;
