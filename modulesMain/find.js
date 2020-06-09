const electron = require('electron');
const { ipcMain } = electron;

// Allows to open search bar
module.exports = (mainWindow) => {
  ipcMain.on('find', (event) => {
    mainWindow.webContents.send('find-start');
  });
};
