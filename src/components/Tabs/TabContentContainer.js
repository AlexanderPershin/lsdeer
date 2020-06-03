import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import TabContent from './TabContent';
import PlusTab from './PlusTab';

const StyledConentContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  position: relative;
`;

const StyledNoTab = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.bg.appBg};
  position: relative;
  overflow: hidden;
`;

const TabContentContainer = () => {
  const tabs = useSelector((state) => state.tabs);
  const activeTab = useSelector((state) => state.activeTab);

  const currentTabObject = tabs.find((item) => item.id === activeTab);

  const renderCurrentTab = () => {
    return <TabContent key={currentTabObject.id} {...currentTabObject} />;
  };

  return (
    <StyledConentContainer>
      {tabs.length > 0 && currentTabObject && currentTabObject.id ? (
        renderCurrentTab()
      ) : (
        <StyledNoTab>
          <PlusTab />
        </StyledNoTab>
      )}
    </StyledConentContainer>
  );
};

export default TabContentContainer;
