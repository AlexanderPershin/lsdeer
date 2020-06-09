import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setSettings } from '../actions/settingsActions';
import { toggleSettings } from '../actions/toggleSettingsActionis';

import defaultTheme from '../themes/default';

const { ipcRenderer } = window.require('electron');

const useSettings = (setSetSettingsOpened) => {
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

    ipcRenderer.on('settings-dropped', () => {
      dispatch(setSettings(defaultTheme));
      ipcRenderer.send('apply-settings-event');
    });

    ipcRenderer.on('apply-settings', () => {
      ipcRenderer.send('save-settings', settings);
    });

    return () => {
      window.removeEventListener('load', (ev) => {
        ipcRenderer.send('get-settings');
      });
    };
  }, [dispatch, setSetSettingsOpened, settings]);
};

export default useSettings;
