const electron = require('electron');
const { ipcMain } = electron;

// Allows to select all files inside current tab
module.exports = (mainWindow) => {
  ipcMain.on('select-all', (event) => {
    mainWindow.webContents.send('all-files-selected');
  });
};
