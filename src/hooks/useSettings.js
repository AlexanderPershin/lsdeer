import { useEffect } from 'react';
import { useSelector, useDispatch, batch } from 'react-redux';

import { setSettings } from '../actions/settingsActions';
import { toggleSettings } from '../actions/toggleSettingsActionis';
import handleSetProp from '../helpers/handleSetProp';
import getPropAction from '../helpers/getPropAction';

import defaultTheme from '../themes/default';

import arrToRgba from '../helpers/arrToRgba';

const { ipcRenderer } = window.require('electron');

const useSettings = () => {
  const tabs = useSelector((state) => state.tabs);
  const activeTab = useSelector((state) => state.activeTab);
  const selectedStore = useSelector((state) => state.selected);
  const drives = useSelector((state) => state.drives);
  const favorites = useSelector((state) => state.favorites);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const activeTabObect = tabs.filter((item) => item.id === activeTab)[0];

  // Settings managment
  useEffect(() => {
    ipcRenderer.on('previous-settings', (event, data) => {
      // Add loaded settings to redux store again
      dispatch(setSettings(data.settings));
    });

    ipcRenderer.on('settings-opened', () => {
      dispatch(toggleSettings());
    });

    ipcRenderer.on('settings-dropped', () => {
      console.log("useSettings -> 'settings-dropped'", 'settings-dropped');

      dispatch(setSettings(defaultTheme));
      ipcRenderer.send('apply-settings-event');
    });

    // TODO: Optimize color scheme, choose appropiate colors for element from extracted array
    ipcRenderer.on('extracted-colors', (event, data) => {
      const { colors, error } = data;
      if (colors && colors.length === 7 && !error) {
        const arrColors = colors
          .map((c) => c._rgb.splice(0, 4))
          .sort((a, b) => {
            const sumA = a.slice(0, 3).reduce((prev, current) => {
              return prev + current;
            }, 0);
            const sumB = b.slice(0, 3).reduce((prev, current) => {
              return prev + current;
            }, 0);
            return sumA > sumB ? -1 : 1;
          })
          .reverse();

        const newAppBg = arrToRgba(arrColors[0], 0.5);
        const newOtherBg = arrToRgba(arrColors[0]);
        const newAppBarBg = arrToRgba(arrColors[4]);
        const newTabSecBg = arrToRgba(arrColors[2]);
        const newScrollbarBg = arrToRgba(arrColors[3]);
        const newElementsBg = arrToRgba(arrColors[5]);
        const newSelectedBg = arrToRgba(arrColors[1]);
        const newSettingsBg = arrToRgba(arrColors[6]);
        batch(() => {
          // Set App Background
          dispatch(getPropAction(false, 'bg', 'appBg', newAppBg));
          dispatch(
            getPropAction(false, 'bg', 'appBarActiveItemBg', newOtherBg)
          );
          dispatch(getPropAction(false, 'bg', 'activeTabBg', newOtherBg));
          dispatch(getPropAction(false, 'bg', 'loadingBg', newOtherBg));
          dispatch(getPropAction(false, 'bg', 'contextMenuBg', newOtherBg));
          dispatch(getPropAction(false, 'bg', 'settingsBg', newOtherBg));
          // Set AppBar Background
          dispatch(getPropAction(false, 'bg', 'appBarBg', newAppBarBg));
          // Set tabBg and secondaryBg
          dispatch(getPropAction(false, 'bg', 'tabBg', newTabSecBg));
          dispatch(getPropAction(false, 'bg', 'secondaryBg', newTabSecBg));
          // Set scrollbarBg
          dispatch(getPropAction(false, 'bg', 'scrollbarBg', newScrollbarBg));
          // Set elementsBg
          dispatch(getPropAction(false, 'bg', 'elementsBg', newElementsBg));
          // Set selectedBg
          dispatch(getPropAction(false, 'bg', 'selectedBg', newSelectedBg));
          // Set settingsBg
          dispatch(getPropAction(false, 'bg', 'accentBg', newSettingsBg));
        });
      } else if (error) {
        alert('Error extracting image color scheme');
      }
    });
  }, [
    activeTab,
    activeTabObect,
    dispatch,
    drives,
    favorites,
    selectedStore,
    settings,
    tabs,
  ]);

  // Save/Load settings
  useEffect(() => {
    window.addEventListener('load', (ev) => {
      ipcRenderer.send('get-settings');
    });

    ipcRenderer.on('apply-settings', () => {
      ipcRenderer.send('save-settings', settings);
    });

    return () => {
      window.removeEventListener('load', (ev) => {
        ipcRenderer.send('get-settings');
      });
    };
  }, [dispatch, settings]);
};

export default useSettings;
