import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { addTab } from '../../actions/tabsActions';
import { setActiveTab } from '../../actions/activeTabActions';
import { nanoid } from 'nanoid';

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

const PlusTab = ({ setPlusClicked }) => {
  const dispatch = useDispatch();

  const addTabAndActivate = () => {
    const newTab = {
      id: nanoid(),
      name: 'New',
    };
    setPlusClicked(true);
    dispatch(addTab(newTab));
    dispatch(setActiveTab(newTab.id));
  };

  return <StyledTab onClick={addTabAndActivate}>+</StyledTab>;
};

export default PlusTab;
