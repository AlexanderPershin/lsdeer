const electron = require('electron');
const { ipcMain, shell } = electron;
const path = require('path');
const fs = require('fs');

const { transfPathForWin } = require('../helpersMain/helpers');

// Allows to view folder/file in os explorer
module.exports = (mainWindow) => {
  ipcMain.on('open-selected-in-explorer', (event) => {
    mainWindow.webContents.send('revealed-in-explorer');
  });

  ipcMain.on('open-in-expolorer', (event, fullpath) => {
    if (!fs.lstatSync(path.normalize(fullpath)).isFile()) {
      // This is folder => open it
      shell.openItem(path.normalize(fullpath));
    } else {
      shell.showItemInFolder(path.normalize(fullpath));
    }
  });
};
