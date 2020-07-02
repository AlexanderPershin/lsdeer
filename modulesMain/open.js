const electron = require('electron');
const { ipcMain } = electron;

// Allows to open path: newPath in tab with id: tabId
module.exports = (mainWindow) => {
  ipcMain.on('open-directory', (event, tabId, newPath, isFile) => {
    console.log('tabId, newPath, isFile', tabId, newPath, isFile);

    mainWindow.webContents.send('directory-opened', {
      tabId,
      newPath,
      isFile,
    });
  });

  ipcMain.on('open-selected-item', (event) => {
    mainWindow.webContents.send('selected-item-opened');
  });
};
