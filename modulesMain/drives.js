const electron = require('electron');
const { exec } = require('child_process');
const { ipcMain, dialog } = electron;
const wmicToDf = require('../helpersMain/wmicToDf');

// Allows to open path: newPath in tab with id: tabId
module.exports = (mainWindow) => {
  ipcMain.on('get-drives', (event) => {
    let command = `df -h`;
    let resp;

    // Well, for windows I'll have to use cmd commands instead of unix's terminal's commands
    const unix_command = `df -h`;
    const win_command = `wmic logicaldisk get deviceid, freespace, size`;

    process.platform === 'win32'
      ? (command = win_command)
      : (command = unix_command);

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      } else if (stderr) {
        console.error(stderr);
      } else {
        if (process.platform === 'win32') {
          resp = wmicToDf(stdout).split('\n');
        } else {
          resp = stdout.split('\n');
        }

        mainWindow.webContents.send('drives-response', {
          response: resp,
        });
      }
    });
  });
};
