const electron = require('electron');
const { ipcMain, dialog, shell } = electron;
const path = require('path');
const deleteFile = require('../helpersMain/deleteFile');

// Allows to delete selected files/folders
module.exports = (mainWindow) => {
  ipcMain.on('delete-selected', (event) => {
    mainWindow.webContents.send('selected-deleted');
  });

  ipcMain.on('x-delete-selected', (event) => {
    mainWindow.webContents.send('selected-x-deleted');
  });

  // TODO: Trash doesn't work on win32 - try using default node.js module

  ipcMain.on('remove-directories', (event, dirPath, filenamesArr) => {
    let options = {
      buttons: ['Ok', 'Cancel'],
      message: 'Move these files to trash?',
    };

    let response = dialog.showMessageBoxSync(options);

    if (response === 0) {
      // move to trash

      filenamesArr.map((item) => {
        const deletingDirPath =
          process.platform === 'win32'
            ? path.win32.normalize(`${dirPath}\\${item}`)
            : path.normalize(`${dirPath}/${item}`);

        console.log(`Deleting dir ${deletingDirPath}`);
        shell.moveItemToTrash(`${deletingDirPath}`);

        return item;
      });
    }
  });

  ipcMain.on(
    'remove-directories-permanently',
    (event, dirPath, filenamesArr) => {
      let options = {
        buttons: ['Ok', 'Cancel'],
        message: 'Permanently delete these files?',
      };

      let response = dialog.showMessageBoxSync(options);

      if (response === 0) {
        // delete all

        filenamesArr.map((item) => {
          deleteFile(`${dirPath}${item}`);

          return item;
        });
      }
    }
  );
};
