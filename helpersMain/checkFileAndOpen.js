const os = require('os');
const fs = require('fs');
const path = require('path');
const shell = require('electron').shell;

const checkFileAndOpen = (dirPath) => {
  if (os.platform() === 'win32') {
    const thisIsFile = fs.lstatSync(dirPath).isFile();

    if (thisIsFile) {
      shell.openItem(dirPath);
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
