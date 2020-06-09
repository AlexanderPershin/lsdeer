const electron = require('electron');
const { ipcMain, shell } = electron;

const { transfPathForWin } = require('../helpersMain/helpers');

// Allows to view folder/file in os explorer
module.exports = (mainWindow) => {
  ipcMain.on('open-selected-in-explorer', (event) => {
    mainWindow.webContents.send('revealed-in-explorer');
  });

  ipcMain.on('open-in-expolorer', (event, fullpath) => {
    if (fullpath.substr(-1) === '/') {
      // This is folder => open it
      if (process.platform === 'win32') {
        const newPath = transfPathForWin(fullpath);
        shell.openItem(newPath);
      } else {
        shell.openItem(fullpath);
      }
    } else {
      // This is file => show in explorer
      if (process.platform === 'win32') {
        const newPath = transfPathForWin(fullpath);
        shell.showItemInFolder(newPath);
      } else {
        shell.showItemInFolder(fullpath);
      }
    }
  });
};
