import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import {
  addSelectedFiles,
  clearSelectedFiles,
} from '../../actions/selectFilesActions';

import TabItem from './TabItem';

const StyledCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const Cell = ({ columnIndex, rowIndex, style, data }) => {
  const { colCount, content } = data;

  const selectedStore = useSelector((state) => state.selected);
  const dispatch = useDispatch();

  const calculateFlatIndex = (colIndex, rowIndex, colCount) => {
    const index = rowIndex * colCount + colIndex;
    return index;
  };

  const flatIndex = calculateFlatIndex(columnIndex, rowIndex, colCount);
  const item = content[flatIndex];

  const handleSelect = useCallback(
    (e, selectedName) => {
      if (e.ctrlKey && selectedStore.includes(selectedName)) {
        dispatch(
          addSelectedFiles(
            selectedStore.filter((item) => item !== selectedName)
          )
        );

        return;
      } else if (e.ctrlKey && !selectedStore.includes(selectedName)) {
        dispatch(addSelectedFiles([...selectedStore, selectedName]));
        return;
      } else if (e.shiftKey && selectedStore.length > 0) {
        const elementFrom = selectedStore[selectedStore.length - 1];

        const contentIdxFrom = content.findIndex(
          (item) => item.name === elementFrom
        );
        const contentIdxTo = content.findIndex(
          (item) => item.name === selectedName
        );

        const newSelectedArr = content
          .slice(
            Math.min(contentIdxFrom, contentIdxTo),
            Math.max(contentIdxFrom, contentIdxTo)
          )
          .map((i) => i.name);

        const nextSelectedStore = [
          ...selectedStore,
          ...newSelectedArr,
          selectedName,
        ];
        const nextUniqueStore = [...new Set(nextSelectedStore)];
        dispatch(addSelectedFiles(nextUniqueStore));
        return;
      } else if (!e.ctrlKey && !selectedStore.includes(selectedName)) {
        dispatch(addSelectedFiles([selectedName]));
        return;
      } else if (
        !e.ctrlKey &&
        selectedStore.includes(selectedName) &&
        selectedStore.length === 1
      ) {
        // Only this item is selected -> do nothing
        // DON'T CHANGE THIS - VERY IMPORTANT
        // ENABLES DOUBLE CLICK EVENT TO OPEN DIRECTORY!
        return;
      } else {
        dispatch(clearSelectedFiles());
        return;
      }
    },
    [content, dispatch, selectedStore]
  );

  const handleSelectRightClick = (name) => {
    if (selectedStore.includes(name)) return;
    dispatch(addSelectedFiles([name]));
  };

  return item ? (
    <StyledCell style={style}>
      <TabItem
        index={flatIndex}
        {...item}
        handleSelect={handleSelect}
        handleSelectRightClick={handleSelectRightClick}
        selected={selectedStore.includes(item.name)}
      />
    </StyledCell>
  ) : null;
};

export default Cell;
