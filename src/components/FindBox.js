import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch, toggleSearch } from '../actions/searchActions';
import { Icon } from '@fluentui/react/lib/Icon';

const StyledFindBox = styled.form`
  position: fixed;
  top: 100px;
  right: 5px;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  border: 5px solid ${({ theme }) => theme.bg.appBg};
  box-shadow: ${({ theme }) =>
    `${theme.shadows.menuShadowOffsetX}px ${theme.shadows.menuShadowOffsetY}px ${theme.shadows.menuShadowBlur}px ${theme.shadows.menuShadowSpread}px ${theme.shadows.menuShadowColor}`};
  background-color: ${({ theme }) => theme.bg.tabBg};
  font-size: ${({ theme }) => theme.font.appSearchFontSize};
`;

const StyledInput = styled.input`
  background-color: ${({ theme }) => theme.bg.appBg};
  color: ${({ theme }) => theme.colors.appColor};
  height: 1.5rem;
  border: none;
  outline: none;
  flex: 1;
  font-size: inherit;
  padding: 0 0.5em;
`;

const StyledSearchBtn = styled.button`
  color: ${({ theme }) => theme.colors.appColor};
  background-color: ${({ theme }) => theme.bg.appBg};
  border-color: transparent;
  flex: 1 1 0%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  padding-left: 0.3em;
  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.bg.selectedBg};
  }
`;

const CloseSearchBtn = styled(StyledSearchBtn)`
  &:hover {
    color: red;
  }
`;

const FindBox = () => {
  const { searching, searchString } = useSelector((state) => state.search);
  const dispatch = useDispatch();

  const [findStr, setFindStr] = useState(searchString || '');

  const inputRef = useRef(null);

  const handleFindStr = (e) => {
    setFindStr(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearch(findStr.trim()));
  };

  const handleClose = (e) => {
    e.preventDefault();
    dispatch(toggleSearch());
  };

  const handleClearSearch = (e) => {
    e.preventDefault();
    setFindStr('');
    dispatch(setSearch(''));
  };

  useEffect(() => {
    setFindStr(searchString);
  }, [searchString, searching]);

  useEffect(() => {
    inputRef && inputRef.current.focus();
  }, []);

  return (
    <StyledFindBox onSubmit={handleSubmit}>
      <StyledInput
        ref={inputRef}
        type='text'
        value={findStr}
        onChange={handleFindStr}
      />
      <StyledSearchBtn type='submit'>
        <Icon iconName='Search' />
      </StyledSearchBtn>
      <StyledSearchBtn onClick={handleClearSearch}>
        <Icon iconName='Delete' />
      </StyledSearchBtn>
      <CloseSearchBtn onClick={handleClose}>
        <Icon iconName='Cancel' />
      </CloseSearchBtn>
    </StyledFindBox>
  );
};

export default FindBox;
