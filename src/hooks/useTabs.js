import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import appConfig from '../app_config.json';
import openInNewTab from '../helpers/openInNewTab';
import { setActiveTab } from '../actions/activeTabActions';
import { closeTab } from '../actions/tabsActions';
import { closeSearch } from '../actions/searchActions';
import { startLoading, stopLoading } from '../actions/loadingActions';

import addTabAndActivate from '../helpers/addTabAndActivate';

const { ipcRenderer } = window.require('electron');

const useTabs = () => {
  const tabs = useSelector((state) => state.tabs);
  const activeTab = useSelector((state) => state.activeTab);
  const selectedStore = useSelector((state) => state.selected);
  const drives = useSelector((state) => state.drives);
  const favorites = useSelector((state) => state.favorites);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const activeTabObect = tabs.filter((item) => item.id === activeTab)[0];

  useEffect(() => {
    if (!activeTab) {
      tabs.length > 0 && dispatch(setActiveTab(tabs[0].id));
    }
  }, [activeTab, dispatch, tabs]);

  // Tabs managment
  useEffect(() => {
    ipcRenderer.on('new-tab-created', (event) => {
      addTabAndActivate(dispatch);
    });

    ipcRenderer.on('current-tab-closed', (event) => {
      const tabPath = activeTabObect ? activeTabObect.path : null;
      ipcRenderer.send('close-tab', activeTab, tabPath);
      dispatch(closeTab(activeTab));
      dispatch(closeSearch());
      const remainingTabs = tabs.filter((item) => item.id !== activeTab);
      remainingTabs.length > 0 &&
        dispatch(setActiveTab(remainingTabs[remainingTabs.length - 1].id));
    });

    ipcRenderer.on('closed-tab', (event, data) => {
      const { tabId, tabPath } = data;
      if (tabPath === 'new-tab-path') {
        return;
      }
      ipcRenderer.send('stop-watching-dir', tabPath, tabId);
    });

    ipcRenderer.on('previous-tabs', (event, data) => {
      data.tabs.map((item, idx) => {
        openInNewTab(item.name, item.path, false, dispatch);
        return item;
      });

      dispatch(stopLoading());
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

  // Save/Load tabs
  // TODO: open hard drive infinite loop bug returned -> fix it!!!
  useEffect(() => {
    window.addEventListener('beforeunload', (ev) => {
      const tabsToSave = tabs.map((item) => ({
        name: item.name,
        id: item.id,
        path: item.path,
      }));
      ipcRenderer.send('save-tabs', tabsToSave);
    });

    window.addEventListener('load', (ev) => {
      ipcRenderer.send('get-tabs');
    });

    const MINUTES = appConfig.SAVE_TABS_DELAY || 5; // save tabs every 5 minutes
    const intervDelay = MINUTES * 60 * 1000;

    const saveInterval = setInterval(() => {
      const tabsToSave = tabs.map((item) => ({ id: item.id, path: item.path }));
      ipcRenderer.send('save-tabs', tabsToSave);
    }, intervDelay);

    return () => {
      window.removeEventListener('beforeunload', (ev) => {
        const tabsToSave = tabs.map((item) => ({
          name: item.name,
          id: item.id,
          path: item.path,
        }));
        ipcRenderer.send('save-tabs', tabsToSave);
      });

      window.removeEventListener('load', (ev) => {
        ipcRenderer.send('get-tabs');
      });

      clearInterval(saveInterval);
    };
  }, [tabs, dispatch]);
};

export default useTabs;
