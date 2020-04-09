import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

  const renderTabsContents = () => {
    return tabs.map((item) => <TabContent key={item.id} {...item} />);
  };

  return <StyledConentContainer>{renderTabsContents()}</StyledConentContainer>;
};

export default TabContentContainer;
