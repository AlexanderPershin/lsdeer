const electron = require('electron');
const { ipcMain } = electron;
const path = require('path');
const fs = require('fs');

// Allows to open path: newPath in tab with id: tabId
module.exports = (mainWindow) => {
  ipcMain.on('create-file-or-dir', () => {
    mainWindow.webContents.send('file-or-dir-created');
  });

  ipcMain.on('new-file', (event, dirPath, filename) => {
    // Create file here
    const creationPath = path.join(dirPath, filename);
    fs.writeFile(creationPath, '', (err, file) => {
      if (err) {
        console.log('newDir module: Error creating file ', creationPath);
        return;
      } else {
        console.log('File created: ', creationPath);
      }
    });
  });

  ipcMain.on('new-folder', (event, dirPath, foldername) => {
    // Create folder here
    const creationPath = path.join(dirPath, foldername);
    fs.mkdir(creationPath, { recursive: true }, (err) => {
      if (err) {
        console.log('newDir module: Error creating file ', creationPath);
        return;
      } else {
        console.log('Folder created: ', creationPath);
      }
    });
  });
};
