import React, { useState, useEffect } from 'react';
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
  box-shadow: ${({ theme }) => theme.shadows.menuShadow};
`;

const StyledSerchBtn = styled.button`
  color: ${({ theme }) => theme.colors.appColor};
  background-color: ${({ theme }) => theme.bg.appBg};
  border-color: transparent;
  flex: 1 1 0%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FindBox = () => {
  // TODO: organize filtering content mechanism here
  // using redux store and tab content manipulations
  // refetch tab content when FindBox is closed
  // or add filterReducer to redux and paste there filtered data
  // and search ? filteredData : content
  const { searching, searchString } = useSelector((state) => state.search);
  const dispatch = useDispatch();

  const [findStr, setFindStr] = useState(searchString || '');

  const handleFindStr = (e) => {
    setFindStr(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearch(findStr));
  };

  const handleClose = (e) => {
    e.preventDefault();
    dispatch(toggleSearch());
  };

  const handleClearSearch = (e) => {
    e.preventDefault();
    dispatch(setSearch(''));
  };

  useEffect(() => {
    setFindStr(searchString);
  }, [searchString, searching]);

  return (
    <StyledFindBox onSubmit={handleSubmit}>
      <input type='text' value={findStr} onChange={handleFindStr} />
      <StyledSerchBtn type='submit'>
        <Icon iconName='Search' />
      </StyledSerchBtn>
      <StyledSerchBtn onClick={handleClearSearch}>
        <Icon iconName='Delete' />
      </StyledSerchBtn>
      <StyledSerchBtn onClick={handleClose}>
        <Icon iconName='Cancel' />
      </StyledSerchBtn>
    </StyledFindBox>
  );
};

export default FindBox;
