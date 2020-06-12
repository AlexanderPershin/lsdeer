import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import addTabAndActivate from '../helpers/addTabAndActivate';

import { closeSearch } from '../actions/searchActions';
import { closeTab } from '../actions/tabsActions';
import { clearSelectedFiles } from '../actions/selectFilesActions';

import { Icon } from '@fluentui/react/lib/Icon';

const { ipcRenderer } = window.require('electron');

const StyledUp = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.appColor};
  padding: 0 5px;
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.font.pathBarFontSize};
  &:hover {
    background-color: ${({ theme }) => theme.bg.selectedBg};
  }
  &:disabled {
    background-color: lightgray;
    cursor: default;
  }
`;

const UpBtn = ({ id, path }) => {
  const dispatch = useDispatch();

  const handleGoUp = () => {
    if (path.length <= 3) {
      dispatch(closeSearch());
      addTabAndActivate(dispatch);
      dispatch(closeTab(id));
      return;
    }
    let path_arr = path.split('/');

    path_arr.splice(-2, 2);
    const newPath = path_arr.join('/') + '/';
    ipcRenderer.send('open-directory', id, newPath);
    dispatch(closeSearch());
    dispatch(clearSelectedFiles());
  };

  return (
    <StyledUp onClick={handleGoUp}>
      <Icon iconName='SortUp' className='ms-IconExample' />
    </StyledUp>
  );
};

export default UpBtn;
