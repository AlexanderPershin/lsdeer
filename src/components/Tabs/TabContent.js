import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDir } from '../../actions/tabsActions';
import styled from 'styled-components';
import { hexToRgba } from 'hex-and-rgba';

import NewTabContent from './NewTabContent';
import TabItem from './TabItem';
import deerBg from '../../img/deer.svg';

const StyledTabContent = styled.div`
  z-index: ${({ active }) => (active ? 100 : 50)};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  grid-gap: 20px;
  overflow-y: auto;
  background: url(${deerBg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  &::-webkit-scrollbar {
    width: 1rem;
    background-color: ${({ theme }) => theme.bg.activeTabBg};
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.bg.tabBg};
    border-left: 2px solid ${({ theme }) => theme.bg.activeTabBg};
    border-right: 2px solid ${({ theme }) => theme.bg.activeTabBg};
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.bg.scrollbarBg};
  }
`;

const StyledFiles = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, min-content));
  grid-auto-rows: min-content;
  grid-gap: 20px;
  align-items: start;
  justify-items: center;
  background-color: ${({ theme }) =>
    hexToRgba(theme.bg.appBg + theme.opac.tabOpac).toString()};
`;

const StyledNav = styled.div`
  align-self: stretch;
  justify-self: stretch;
  grid-column: 1 / -1;
  border: 2px solid darkred;
`;

const StyledUp = styled.button`
  border: none;
  background-color: darkgreen;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
  &:disabled {
    background-color: lightgray;

    cursor: default;
  }
`;

const TabContent = ({ id, name, content, createNew = false, path }) => {
  const [selected, setSelected] = useState(null);

  const activeTab = useSelector((state) => state.activeTab);
  const dispatch = useDispatch();

  const handleSelect = (name) => {
    if (name === selected) {
      setSelected(null);
      return;
    }
    setSelected(name);
  };

  const handleGoUp = () => {
    if (path.length <= 2) return;
    let path_arr = path.split('/');
    path_arr.pop();
    const newPath = path_arr.join('/');
    dispatch(openDir(id, newPath));
  };

  // TODO: istead of slice(0,50) make scroll loading content of page or show more btn

  const renderContent = () => {
    return content
      .slice(0, 50)
      .map((item, i) => (
        <TabItem
          key={`${item.name} ${i}`}
          {...item}
          selected={selected}
          handleSelect={handleSelect}
        />
      ));
  };

  return (
    <StyledTabContent active={id === activeTab}>
      {createNew ? (
        <NewTabContent />
      ) : (
        <StyledFiles>
          <StyledNav>
            <StyledUp onClick={handleGoUp} disabled={path.length <= 2}>
              Up
            </StyledUp>
          </StyledNav>

          {renderContent()}
        </StyledFiles>
      )}
    </StyledTabContent>
  );
};

export default TabContent;
