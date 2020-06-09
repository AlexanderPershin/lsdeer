const electron = require('electron');
const { ipcMain } = electron;

// Allows to toggle app interface
module.exports = (mainWindow) => {
  ipcMain.on('toggle-interface', (event) => {
    mainWindow.webContents.send('interface-toggled');
  });
};
