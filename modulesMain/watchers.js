const electron = require('electron');
const { ipcMain } = electron;
const chokidar = require('chokidar');

const { transfPathForWin } = require('../helpersMain/helpers');
console.log('loading watchers module');

let watchedArray = []; // Array of tab id's and paths that are being watched now
// Allows to whatch opened tabs for changes and refresh them
module.exports = (mainWindow) => {
  // Set/add/remove watchers for open in tabs directories
  ipcMain.on('start-watching-dir', (event, dirPath, tabId) => {
    // Unwatch previous path of this tab
    const perviouslyThisTab = watchedArray.find((item) => item.id === tabId);
    if (perviouslyThisTab) {
      perviouslyThisTab.watcher.close();
    }
    watchedArray = watchedArray.filter((item) => item.id !== tabId);

    try {
      const pathToWatch =
        process.platform === 'win32' ? transfPathForWin(dirPath) : dirPath;

      const watcher = chokidar.watch(pathToWatch, {
        persistent: true,
        ignored: '*.sys',
        ignoreInitial: true,
        followSymlinks: true,
        cwd: '.',
        disableGlobbing: false,
        usePolling: false,
        interval: 100,
        binaryInterval: 300,
        alwaysStat: false,
        depth: 0,
        awaitWriteFinish: {
          stabilityThreshold: 2000,
          pollInterval: 100,
        },
        ignorePermissionErrors: false,
        atomic: true, // or a custom 'atomicity delay', in milliseconds (default 100)
      });
      // Add event listeners.
      // TODO: Bugged unlink dir - fix
      watcher.on('raw', (event, path, details) => {
        // internal
        if (event === 'change') return;
        console.log('Raw event info:', event, path, details);

        mainWindow.webContents.send('refresh-tab', { tabId, dirPath });
      });

      watchedArray.push({ id: tabId, path: dirPath, watcher });
    } catch (err) {
      // error watching - no access or something
      console.log('Watch dir error', err);
    }
  });

  ipcMain.on('stop-watching-dir', (event, dirPath, tabId) => {
    // On close directory/go up/open sudirectory
    const watchedItem = watchedArray.find((item) => item.id === tabId);
    try {
      watchedItem && watchedItem.watcher.close();
      watchedArray = watchedArray.filter((item) => item.id !== tabId);
    } catch (err) {
      // error watching - no access or something
      console.log('Watch dir error', err);
    }
  });

  ipcMain.on('stop-watching-all', (event) => {
    // unwatch all here
    watchedArray.map((item) => item.watcher.close());
    watchedArray = [];
  });
  //   Refactor this code to unwatch tabs through separate listener
  //   This one belongs to tabs module
  ipcMain.on('close-tabs', (event, data) => {
    const { excludedTabs } = data; // list of ids
    watchedArray = watchedArray.filter((item) => {
      if (excludedTabs.includes(item.id)) {
        return true;
      } else {
        item.watcher.close();
        return false;
      }
    });
  });
};
