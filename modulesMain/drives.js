const electron = require('electron');
const { exec } = require('child_process');
const { ipcMain } = electron;

// Allows to open path: newPath in tab with id: tabId
module.exports = (mainWindow) => {
  ipcMain.on('get-drives', (event) => {
    const command = `df -h`;

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      } else {
        mainWindow.webContents.send('drives-response', {
          response: stdout.split('\n'),
        });
      }
    });
  });
};
