import React from 'react';
import styled from 'styled-components';

const StyledTab = styled.div`
  flex: 0 0 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: ${({ theme, activeTab }) =>
    activeTab ? theme.bg.activeTabBg : theme.bg.tabBg};
  &:not(:last-child) {
    border-right: 2px solid ${({ theme }) => theme.bg.appBg};
  }
  &:hover {
    cursor: pointer;
  }
`;

const StyledXBtn = styled.span`
  margin-left: 1rem;
  font-size: 1.2rem;
`;

const Tab = ({
  id,
  name,
  active,
  setActiveTab,
  onClick: propsOnClick,
  closeTab,
}) => {
  return (
    <StyledTab
      activeTab={id === active ? true : false}
      onClick={() => {
        propsOnClick ? propsOnClick() : setActiveTab(id);
      }}
    >
      <span>{name}</span>
      {id === 'plus_tab' ? null : (
        <StyledXBtn onClick={() => closeTab(id)}>&times;</StyledXBtn>
      )}
    </StyledTab>
  );
};

Tab.defaultProps = {
  id: 'id',
  name: 'default',
  active: 'default',
  setActiveTab: () => {},
};

export default Tab;
