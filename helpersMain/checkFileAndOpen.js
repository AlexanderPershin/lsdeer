const os = require('os');
const fs = require('fs');
const shell = require('electron').shell;
const { transfPathForWin } = require('./helpers');

const checkFileAndOpen = (dirPath) => {
  if (os.platform() === 'win32') {
    const newPath = transfPathForWin(dirPath);

    const thisIsFile = fs.lstatSync(newPath).isFile();

    if (thisIsFile) {
      shell.openItem(newPath);
      return true;
    } else {
      return false;
    }
  } else {
    const thisIsFile = fs.lstatSync(dirPath).isFile();

    if (thisIsFile) {
      shell.openItem(dirPath);
      return true;
    } else {
      return false;
    }
  }
};

module.exports = checkFileAndOpen;
