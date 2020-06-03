import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import ColorInput from '../Inputs/ColorInput';
import NumInp from '../Inputs/NumInp';

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

const ColorSchemeSettings = ({ handleSetProp }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <StyledInputsWrapper>
      <StyledSettingsGroupHeding>Color Scheme</StyledSettingsGroupHeding>
      <span>Font color</span>
      <ColorInput
        value={themeContext.colors.appColor}
        onChange={(newVal) =>
          handleSetProp(false, 'colors', 'appColor', newVal)
        }
      />

      <span>Background color</span>
      <ColorInput
        value={themeContext.bg.appBg}
        onChange={(newVal) => handleSetProp(false, 'bg', 'appBg', newVal)}
      />

      <span>Selection background color</span>
      <ColorInput
        value={themeContext.bg.selectedBg}
        onChange={(newVal) => handleSetProp(false, 'bg', 'selectedBg', newVal)}
      />
      <span>Ui elements background color</span>
      <ColorInput
        value={themeContext.bg.tabBg}
        onChange={(newVal) => handleSetProp(false, 'bg', 'tabBg', newVal)}
      />
      <span>Secondary ui elements background color</span>
      <ColorInput
        value={themeContext.bg.elementsBg}
        onChange={(newVal) => handleSetProp(false, 'bg', 'elementsBg', newVal)}
      />
      <span>Active ui element background color</span>
      <ColorInput
        value={themeContext.bg.activeTabBg}
        onChange={(newVal) => handleSetProp(false, 'bg', 'activeTabBg', newVal)}
      />
      <span>Scrollbar hover background color</span>
      <ColorInput
        value={themeContext.bg.scrollbarBg}
        onChange={(newVal) => handleSetProp(false, 'bg', 'scrollbarBg', newVal)}
      />
      <span>Accent background color</span>
      <ColorInput
        value={themeContext.bg.accentBg}
        onChange={(newVal) => handleSetProp(false, 'bg', 'accentBg', newVal)}
      />
      <span>Secondary background color</span>
      <ColorInput
        value={themeContext.bg.secondaryBg}
        onChange={(newVal) => handleSetProp(false, 'bg', 'secondaryBg', newVal)}
      />

      <StyledSettingsGroupHeding>App bar styles</StyledSettingsGroupHeding>
      <span>Background</span>
      <ColorInput
        value={themeContext.bg.appBarBg}
        onChange={(newVal) => handleSetProp(false, 'bg', 'appBarBg', newVal)}
      />
      <span>Title color</span>
      <ColorInput
        value={themeContext.colors.appTitleColor}
        onChange={(newVal) =>
          handleSetProp(false, 'colors', 'appTitleColor', newVal)
        }
      />
      <span>Active item background</span>
      <ColorInput
        value={themeContext.bg.appBarActiveItemBg}
        onChange={(newVal) =>
          handleSetProp(false, 'bg', 'appBarActiveItemBg', newVal)
        }
      />
      <span>Close button background</span>
      <ColorInput
        value={themeContext.bg.appBarXBtnHover}
        onChange={(newVal) =>
          handleSetProp(false, 'bg', 'appBarXBtnHover', newVal)
        }
      />

      <StyledSettingsGroupHeding>Shadows</StyledSettingsGroupHeding>
      <span>Menu shadow color</span>
      <ColorInput
        value={themeContext.shadows.menuShadowColor}
        onChange={(newVal) =>
          handleSetProp(false, 'shadows', 'menuShadowColor', newVal)
        }
      />

      <span>Menu shadow offset X</span>
      <NumInp
        min={-100}
        max={100}
        step={0.5}
        disabled={false}
        value={themeContext.shadows.menuShadowOffsetX}
        handleSetProp={(newVal) =>
          handleSetProp(false, 'shadows', 'menuShadowOffsetX', newVal)
        }
      />

      <span>Menu shadow offset Y</span>
      <NumInp
        min={-100}
        max={100}
        step={0.5}
        disabled={false}
        value={themeContext.shadows.menuShadowOffsetY}
        handleSetProp={(newVal) =>
          handleSetProp(false, 'shadows', 'menuShadowOffsetY', newVal)
        }
      />

      <span>Menu shadow blur</span>
      <NumInp
        min={0}
        max={100}
        step={0.5}
        disabled={false}
        value={themeContext.shadows.menuShadowBlur}
        handleSetProp={(newVal) =>
          handleSetProp(false, 'shadows', 'menuShadowBlur', newVal)
        }
      />

      <span>Menu shadow spread</span>
      <NumInp
        min={0}
        max={100}
        step={0.5}
        disabled={false}
        value={themeContext.shadows.menuShadowSpread}
        handleSetProp={(newVal) =>
          handleSetProp(false, 'shadows', 'menuShadowSpread', newVal)
        }
      />

      <span>NavBar shadow color</span>
      <ColorInput
        value={themeContext.shadows.navShadowColor}
        onChange={(newVal) =>
          handleSetProp(false, 'shadows', 'navShadowColor', newVal)
        }
      />

      <span>Nav shadow offset X</span>
      <NumInp
        min={-100}
        max={100}
        step={0.5}
        disabled={false}
        value={themeContext.shadows.navShadowOffsetX}
        handleSetProp={(newVal) =>
          handleSetProp(false, 'shadows', 'navShadowOffsetX', newVal)
        }
      />

      <span>Nav shadow offset Y</span>
      <NumInp
        min={-100}
        max={100}
        step={0.5}
        disabled={false}
        value={themeContext.shadows.navShadowOffsetY}
        handleSetProp={(newVal) =>
          handleSetProp(false, 'shadows', 'navShadowOffsetY', newVal)
        }
      />

      <span>Nav shadow blur</span>
      <NumInp
        min={0}
        max={100}
        step={0.5}
        disabled={false}
        value={themeContext.shadows.navShadowBlur}
        handleSetProp={(newVal) =>
          handleSetProp(false, 'shadows', 'navShadowBlur', newVal)
        }
      />

      <span>Nav shadow spread</span>
      <NumInp
        min={0}
        max={100}
        step={0.5}
        disabled={false}
        value={themeContext.shadows.navShadowSpread}
        handleSetProp={(newVal) =>
          handleSetProp(false, 'shadows', 'navShadowSpread', newVal)
        }
      />
    </StyledInputsWrapper>
  );
};

export default ColorSchemeSettings;
