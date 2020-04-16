import React from 'react';
import styled from 'styled-components';
import Folder from '../Icons/Folder';
import File from '../Icons/File';
import folder from '../../img/folder.svg';
import file from '../../img/icons/blank-file.svg';

const StyledWrapper = styled.div`
  width: 100px;
  height: 100px;
  & > svg {
    fill: ${({ theme }) => theme.colors.iconColor};
  }
`;

const FileIcon = ({ ext }) => {
  const getIcon = () => {
    switch (ext) {
      case false:
        return <Folder />;
      default:
        return <File />;
    }
  };

  return <StyledWrapper>{getIcon()}</StyledWrapper>;
};

export default FileIcon;
