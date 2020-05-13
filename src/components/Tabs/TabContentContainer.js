import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hexToRgba } from 'hex-and-rgba';
import styled from 'styled-components';

import TabContent from './TabContent';

const StyledConentContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  position: relative;
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
      {tabs.length > 0 && currentTabObject && currentTabObject.id
        ? renderCurrentTab()
        : null}
    </StyledConentContainer>
  );
};

export default TabContentContainer;
