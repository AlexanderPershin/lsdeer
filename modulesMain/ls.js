const electron = require('electron');
const { ipcMain } = electron;

const checkFileAndOpen = require('../helpersMain/checkFileAndOpen');

const listDirectory = require('../helpersMain/listDirectory');

module.exports = (mainWindow) => {
  ipcMain.on('ls-directory', (event, dirPath, tabId) => {
    listDirectory(dirPath, (dirArray) => {
      const itWasFile = checkFileAndOpen(dirPath);
      if (itWasFile) return;

      mainWindow.webContents.send('resp-dir', {
        response: dirArray,
        tabId,
        newPath: dirPath,
      });
    });
  });
};
