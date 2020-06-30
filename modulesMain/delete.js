const electron = require('electron');
const { ipcMain, dialog } = electron;
const { exec } = require('child_process');
const trash = require('trash');
const deleteFile = require('../helpersMain/deleteFile');
const { transfPathForWin } = require('../helpersMain/helpers');

// Allows to delete selected files/folders
module.exports = (mainWindow) => {
  ipcMain.on('delete-selected', (event) => {
    mainWindow.webContents.send('selected-deleted');
  });

  ipcMain.on('x-delete-selected', (event) => {
    mainWindow.webContents.send('selected-x-deleted');
  });

  ipcMain.on('remove-directories', (event, dirPath, filenamesArr) => {
    let options = {
      buttons: ['Ok', 'Cancel'],
      message: 'Move these files to trash?',
    };

    let response = dialog.showMessageBoxSync(options);

    if (response === 0) {
      // move to trash

      filenamesArr.map((item) => {
        trash(`${dirPath}${item}`).then((e) => {
          console.log(`${dirPath}${item} has been deleted`);
          mainWindow.webContents.send('edit-action-complete', {
            dirPath,
          });
        });

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
          // const command = `rm -r "${dirPath}${item}"`;

          // exec(command, (err, stdout, stderr) => {
          //   if (err) {
          //     console.error(err);
          //   } else {
          //     mainWindow.webContents.send('delete-file-resp', {
          //       response: true,
          //     });
          //   }
          // });
          deleteFile(`${dirPath}${item}`);

          return item;
        });
      }
    }
  );
};
