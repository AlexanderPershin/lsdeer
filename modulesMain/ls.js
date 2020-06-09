const electron = require('electron');
const { ipcMain } = electron;
const os = require('os');
const { exec } = require('child_process');

const { clearArrayOfStrings } = require('../helpersMain/helpers');

const formDirArrayWin = require('../helpersMain/formDirArrayWin');
const formDirArrayLinux = require('../helpersMain/formDirArrayLinux');
const checkFileAndOpen = require('../helpersMain/checkFileAndOpen');

module.exports = (mainWindow) => {
  ipcMain.on('ls-directory', (event, dirPath, tabId) => {
    const command = `ls "${dirPath}" -p -1v --hide=*.sys --hide="System Volume Information" --group-directories-first`;

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
            outputArray = formDirArrayWin(namesArray, dirPath);
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
