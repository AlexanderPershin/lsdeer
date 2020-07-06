const electron = require('electron');
const { ipcMain } = electron;

// Allows to open path: newPath in tab with id: tabId
module.exports = (mainWindow) => {
  ipcMain.on('create-file-or-dir', () => {
    mainWindow.webContents.send('file-or-dir-created');
    console.log('create-file-or-dir event');
  });

  ipcMain.on('new-file', (event, filePath) => {
    // Create file here
    console.log('File created: ', filePath);
  });

  ipcMain.on('new-folder', (event, folderPath) => {
    // Create folder here
    console.log('Folder created: ', folderPath);
  });
};
