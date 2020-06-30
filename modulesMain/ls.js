const electron = require('electron');
const { ipcMain } = electron;
const os = require('os');
const { exec } = require('child_process');

const { clearArrayOfStrings } = require('../helpersMain/helpers');

const formDirArrayWin = require('../helpersMain/formDirArrayWin');
const formDirArrayLinux = require('../helpersMain/formDirArrayLinux');
const checkFileAndOpen = require('../helpersMain/checkFileAndOpen');
const dirToLs = require('../helpersMain/dirToLs');

module.exports = (mainWindow) => {
  ipcMain.on('ls-directory', (event, dirPath, tabId) => {
    let command;
    const command_unix = `ls "${dirPath}" -p -1v --hide=*.sys --hide="System Volume Information" --group-directories-first`;
    const command_win = `dir ${dirPath} /o`;

    if (process.platform === 'win32') {
      command = command_win;
    } else {
      command = command_unix;
    }

    try {
      const itWasFile = checkFileAndOpen(dirPath);
      if (itWasFile) return;

      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
        } else {
          let outputArray = [];

          const namesArray = clearArrayOfStrings(stdout.toString().split('\n'));

          if (os.platform() === 'win32') {
            const convNamesArr = dirToLs(namesArray);
            outputArray = formDirArrayWin(convNamesArr, dirPath);
          } else {
            outputArray = formDirArrayLinux(namesArray, dirPath);
          }

          mainWindow.webContents.send('resp-dir', {
            response: outputArray,
            tabId,
            newPath: dirPath,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
};
