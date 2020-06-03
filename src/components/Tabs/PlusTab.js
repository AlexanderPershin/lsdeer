import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@fluentui/react/lib/Icon';

import addTabAndActivate from '../../helpers/addTabAndActivate';

const StyledTab = styled.div`
  flex: 0 0 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.7rem 1rem;
  background-color: ${({ theme, activeTab }) =>
    activeTab ? theme.bg.activeTabBg : theme.bg.tabBg};
  user-select: none;
  animation: ${({ theme, pulse }) => (pulse ? 'pulse 1s infinite' : 'none')};
  &:not(:last-child) {
    border-right: 2px solid ${({ theme }) => theme.bg.appBg};
  }
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg.selectedBg};
  }
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0px ${({ theme }) => theme.bg.selectedBg};
    }
    100% {
      box-shadow: 0 0 0 100px rgba(0, 0, 0, 0);
    }
  }
`;

const StyledTabIcon = styled(Icon)`
  font-size: 70%;
`;

const PlusTab = ({ setPlusClicked }) => {
  const tabs = useSelector((state) => state.tabs);
  const dispatch = useDispatch();

  return (
    <StyledTab
      onClick={() => addTabAndActivate(dispatch)}
      pulse={tabs.length === 0}
    >
      <StyledTabIcon iconName='Add' />
    </StyledTab>
  );
};

export default PlusTab;
