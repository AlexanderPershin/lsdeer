import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeTab } from '../../actions/tabsActions';
import { setActiveTab } from '../../actions/activeTabActions';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { Icon } from '@fluentui/react/lib/Icon';
import styled from 'styled-components';

const StyledTab = styled.div`
  flex: 0 0 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
  user-select: none;
  white-space: nowrap;
  background-color: ${({ theme, activeTab }) =>
    activeTab ? theme.bg.activeTabBg : theme.bg.tabBg};
  &:not(:last-child) {
    border-right: 2px solid ${({ theme }) => theme.bg.appBg};
  }
  &:hover {
    cursor: pointer;
  }
`;

const StyledContextMenu = styled(ContextMenu)`
  background-color: ${({ theme }) => theme.bg.appBg};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 5px;
  z-index: 1000;
  border: 2px solid #fff;
`;

const StyledTabIcon = styled(Icon)`
  font-size: 70%;
  margin-left: 10px;
`;

const Tab = ({ id, name }) => {
  const activeTab = useSelector((state) => state.activeTab);
  const tabs = useSelector((state) => state.tabs);
  const dispatch = useDispatch();

  const [isLocked, setLocked] = useState(false);

  const closeThisTab = (e) => {
    e.stopPropagation();
    if (id === activeTab && tabs.length > 1) {
      const nextTab = tabs.filter((item) => item.id !== activeTab)[0].id;

      dispatch(setActiveTab(nextTab));
    }

    dispatch(closeTab(id));
  };

  const setActive = () => {
    dispatch(setActiveTab(id));
  };

  const toggleLock = () => {
    setLocked((prev) => !prev);
  };

  return (
    <React.Fragment>
      <ContextMenuTrigger id={id}>
        {' '}
        <StyledTab
          activeTab={id === activeTab ? true : false}
          onClick={setActive}
        >
          <span>{name}</span>
          {isLocked ? (
            <StyledTabIcon iconName='LockSolid' />
          ) : (
            <StyledTabIcon iconName='ChromeClose' onClick={closeThisTab} />
          )}
        </StyledTab>
      </ContextMenuTrigger>{' '}
      <StyledContextMenu id={id}>
        {!isLocked && (
          <MenuItem data={{ foo: 'bar' }} onClick={closeThisTab}>
            Close Tab
          </MenuItem>
        )}
        <MenuItem data={{ foo: 'bar' }} onClick={toggleLock}>
          {isLocked ? 'Unlock Tab' : 'Lock Tab'}
        </MenuItem>
        <MenuItem divider />
      </StyledContextMenu>
    </React.Fragment>
  );
};

Tab.defaultProps = {
  id: 'id',
  name: 'default',
  active: 'default',
  setActiveTab: () => {},
};

export default Tab;
