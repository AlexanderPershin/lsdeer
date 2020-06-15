import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setSettings } from '../actions/settingsActions';
import { toggleSettings } from '../actions/toggleSettingsActionis';
import handleSetProp from '../helpers/handleSetProp';

import defaultTheme from '../themes/default';

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
        const arrColors = colors.map((c) => c._rgb.splice(0, 4));
        console.log('useSettings -> arrColors', arrColors);

        // Set App Background
        const newRawAppBg = arrColors[0];
        const newAppBg = `rgba(${newRawAppBg[0]},${newRawAppBg[1]},${
          newRawAppBg[2]
        },${0.5})`;
        const newOtherBg = `rgba(${newRawAppBg[0]},${newRawAppBg[1]},${newRawAppBg[2]},${newRawAppBg[3]})`;
        handleSetProp(false, 'bg', 'appBg', newAppBg, dispatch);
        handleSetProp(false, 'bg', 'appBarActiveItemBg', newOtherBg, dispatch);
        handleSetProp(false, 'bg', 'activeTabBg', newOtherBg, dispatch);
        handleSetProp(false, 'bg', 'loadingBg', newOtherBg, dispatch);
        handleSetProp(false, 'bg', 'contextMenuBg', newOtherBg, dispatch);

        // Set AppBar Background
        const newRawAppBarBg = arrColors[1];
        const newAppBarBg = `rgba(${newRawAppBarBg[0]},${newRawAppBarBg[1]},${newRawAppBarBg[2]},${newRawAppBarBg[3]})`;
        handleSetProp(false, 'bg', 'appBarBg', newAppBarBg, dispatch);

        // Set tabBg and secondaryBg
        const newRawTabSecBg = arrColors[2];
        const newTabSecBg = `rgba(${newRawTabSecBg[0]},${newRawTabSecBg[1]},${newRawTabSecBg[2]},${newRawTabSecBg[3]})`;
        handleSetProp(false, 'bg', 'tabBg', newTabSecBg, dispatch);
        handleSetProp(false, 'bg', 'secondaryBg', newTabSecBg, dispatch);

        // Set scrollbarBg
        const newScrollbarRawBg = arrColors[3];
        const newScrollbarBg = `rgba(${newScrollbarRawBg[0]},${newScrollbarRawBg[1]},${newScrollbarRawBg[2]},${newScrollbarRawBg[3]})`;
        handleSetProp(false, 'bg', 'scrollbarBg', newScrollbarBg, dispatch);

        // Set elementsBg
        const newElementsRawBg = arrColors[5];
        const newElementsBg = `rgba(${newElementsRawBg[0]},${newElementsRawBg[1]},${newElementsRawBg[2]},${newElementsRawBg[3]})`;
        handleSetProp(false, 'bg', 'elementsBg', newElementsBg, dispatch);

        // Set selectedBg
        const newSelectedRawBg = arrColors[4];
        const newSelectedBg = `rgba(${newSelectedRawBg[0]},${newSelectedRawBg[1]},${newSelectedRawBg[2]},${newSelectedRawBg[3]})`;
        handleSetProp(false, 'bg', 'selectedBg', newSelectedBg, dispatch);

        // Set settingsBg
        const newSettingsRawBg = arrColors[6];
        const newSettingsBg = `rgba(${newSettingsRawBg[0]},${newSettingsRawBg[1]},${newSettingsRawBg[2]},${newSettingsRawBg[3]})`;
        handleSetProp(false, 'bg', 'selectedBg', newSettingsBg, dispatch);
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
