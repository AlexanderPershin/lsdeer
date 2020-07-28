import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import NumInp from '../Inputs/NumInp';
import Select from '../Inputs/Select';

const StyledInputsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 35px;
  grid-gap: 20px;
  align-items: center;
  & > span {
    justify-self: end;
  }
`;

const StyledSettingsGroupHeding = styled.h2`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-content: center;
  margin: 1rem 0;
  font-size: 2rem;
  font-weight: 100;
  padding-top: 15px;
`;

const fileIconSizeOpts = [
  { label: '16x16', value: 16 },
  { label: '20x20', value: 20 },
  { label: '32x32', value: 32 },
  { label: '40x40', value: 40 },
  { label: '48x48', value: 48 },
  { label: '64x64', value: 64 },
  { label: '96x96', value: 96 },
];

const SizesSettings = ({ handleSetProp }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <StyledInputsWrapper>
      <StyledSettingsGroupHeding>Sizes</StyledSettingsGroupHeding>
      <span>Focus outline width</span>
      <NumInp
        min={0}
        max={10}
        step={0.5}
        disabled={false}
        value={parseFloat(
          themeContext.sizes.focusOutlineWidth.replace('px', '')
        )}
        handleSetProp={(newVal) =>
          handleSetProp(false, 'sizes', 'focusOutlineWidth', newVal + 'px')
        }
      />

      <span>Grid row height</span>
      <NumInp
        min={50}
        max={500}
        step={1}
        disabled={false}
        value={themeContext.sizes.rowHeight}
        handleSetProp={(newVal) =>
          handleSetProp(false, 'sizes', 'rowHeight', newVal)
        }
      />

      <span>Grid column width</span>
      <NumInp
        min={50}
        max={500}
        step={1}
        disabled={false}
        value={themeContext.sizes.colWidth}
        handleSetProp={(newVal) =>
          handleSetProp(false, 'sizes', 'colWidth', newVal)
        }
      />

      <span>File icon size</span>
      <Select
        value={themeContext.sizes.fileIconSize}
        optionsArray={fileIconSizeOpts}
        onChange={(newVal) =>
          handleSetProp(false, 'sizes', 'fileIconSize', newVal)
        }
      />

      <span title="Performance warning!">Favorites page size</span>
      <NumInp
        min={1}
        max={300}
        step={1}
        disabled={false}
        value={themeContext.sizes.favPageSize}
        handleSetProp={(newVal) =>
          handleSetProp(false, 'sizes', 'favPageSize', newVal)
        }
      />

      <span title="Performance warning!">Filename truncate width</span>
      <NumInp
        min={1}
        max={300}
        step={1}
        disabled={false}
        value={themeContext.sizes.itemNameTrunc}
        handleSetProp={(newVal) =>
          handleSetProp(false, 'sizes', 'itemNameTrunc', newVal)
        }
      />
    </StyledInputsWrapper>
  );
};

export default SizesSettings;
