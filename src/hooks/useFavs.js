import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import appConfig from '../app_config.json';
import { nanoid } from 'nanoid';

import { addToFav } from '../actions/favoritesActions';

const { ipcRenderer } = window.require('electron');

const useFavs = () => {
  const tabs = useSelector((state) => state.tabs);
  const activeTab = useSelector((state) => state.activeTab);
  const selectedStore = useSelector((state) => state.selected);
  const drives = useSelector((state) => state.drives);
  const favorites = useSelector((state) => state.favorites);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const activeTabObect = tabs.filter((item) => item.id === activeTab)[0];

  // Favs managment
  useEffect(() => {
    ipcRenderer.on('previous-favorites', (event, data) => {
      // Add loaded favs to redux store again
      dispatch(addToFav(data.favorites));

      ipcRenderer.on('selected-added-to-favs', (event) => {
        const tabPath = activeTabObect ? activeTabObect.path : null;

        if (selectedStore.length > 0) {
          const activePath = tabPath;
          const newFavs = selectedStore.map((item) => {
            const contentObj = activeTabObect.content.find(
              (itm) => itm.name === item
            );

            return {
              id: nanoid(),
              name: item,
              path: `${activePath}${item}`,
              isFile: contentObj.isFile,
              ext: contentObj.ext,
            };
          });

          dispatch(addToFav(newFavs));
        } else {
          return;
        }
      });
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

  // Save/Load favorites
  useEffect(() => {
    window.addEventListener('beforeunload', (ev) => {
      ipcRenderer.send('save-favs', favorites);
    });

    window.addEventListener('load', (ev) => {
      ipcRenderer.send('get-favorites');
    });

    const MINUTES = appConfig.SAVE_TABS_DELAY || 5; // save tabs every 5 minutes
    const intervDelay = MINUTES * 60 * 1000;

    const saveInterval = setInterval(() => {
      ipcRenderer.send('save-favs', favorites);
    }, intervDelay);

    // ipcRenderer.on('previous-favorites', (event, data) => {
    //   // Add loaded favs to redux store again
    //   dispatch(addToFav(data.favorites));
    // });

    return () => {
      window.removeEventListener('beforeunload', (ev) => {
        ipcRenderer.send('save-favs', favorites);
      });

      window.removeEventListener('load', (ev) => {
        ipcRenderer.send('get-favorites');
      });

      clearInterval(saveInterval);
    };
  }, [activeTab, activeTabObect, dispatch, favorites, selectedStore, tabs]);
};

export default useFavs;
