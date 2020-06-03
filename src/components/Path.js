import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Icon } from '@fluentui/react/lib/Icon';
import { clearSelectedFiles } from '../actions/selectFilesActions';

const { ipcRenderer } = window.require('electron');

const StyledTabPath = styled.div`
  max-width: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  color: ${({ theme }) => theme.colors.appColor};
  border: none;
  padding: 0 1rem;
  opacity: 0.6;
  font-size: ${({ theme }) => theme.font.pathBarFontSize};
  overflow-x: auto;
  overflow-y: hidden;
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

const StyledPathItem = styled.div`
  flex: 0 1 0%;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  padding: 0 0.2em;
  background-color: transparent;
  &:hover {
    background-color: ${({ theme }) => theme.bg.selectedBg};
  }
`;

const StyledPathIcon = styled(Icon)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
`;

const Path = ({ path }) => {
  const activeTab = useSelector((state) => state.activeTab);
  const dispatch = useDispatch();

  const pathRef = useRef(null);

  const handleScrollPath = (e) => {
    e.stopPropagation();
    pathRef.current.scrollLeft += e.deltaY;
  };

  const handlePathOpen = (pathArr) => {
    const newPath = pathArr.join('/');
    console.log('handlePathOpen -> newPath', newPath);

    dispatch(clearSelectedFiles());
    ipcRenderer.send('open-directory', activeTab, '/' + newPath + '/', false);
  };

  const renderPathNav = () => {
    const pathArr = path.split('/').filter((i) => i);
    return pathArr.map((item, idx) => {
      if (item) {
        return (
          <React.Fragment key={item}>
            <StyledPathItem
              onClick={() => handlePathOpen(pathArr.slice(0, idx + 1))}
            >
              {item}
            </StyledPathItem>
            {idx + 1 === pathArr.length ? null : (
              <StyledPathIcon
                iconName='ChevronRightMed'
                className='ms-IconExample'
              />
            )}
          </React.Fragment>
        );
      }
      return null;
    });
  };

  return (
    <StyledTabPath ref={pathRef} onWheel={handleScrollPath}>
      {path && renderPathNav()}
    </StyledTabPath>
  );
};

export default Path;
