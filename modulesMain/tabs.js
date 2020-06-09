const electron = require('electron');
const { ipcMain } = electron;

// Allows to view folder/file in os explorer
module.exports = (mainWindow) => {
  ipcMain.on('new-tab', (event) => {
    mainWindow.webContents.send('new-tab-created');
  });

  ipcMain.on('close-current-tab', (event) => {
    mainWindow.webContents.send('current-tab-closed');
  });

  ipcMain.on('close-tab', (event, tabId, tabPath) => {
    mainWindow.webContents.send('closed-tab', {
      tabId,
      tabPath,
    });
  });
};
