const electron = require('electron');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');
const util = require('util');
const shell = require('electron').shell;

const fileCheck = (dirPath, name) => {
  return fs.lstatSync(path.normalize(path.join(dirPath, name))).isFile();
};

const transfPathForWin = (dPath) => {
  try {
    const pathArr = dPath.split('/').filter((item) => item !== '');
    const drive = pathArr[0].toUpperCase() + '://';
    pathArr.shift();
    return path.normalize(path.join(drive, ...pathArr));
  } catch (e) {
    return dPath;
  }
};

const clearArrayOfStrings = (arr) => {
  return arr.filter((item) => item !== '' && item !== '..' && item !== '.');
};

module.exports = {
  fileCheck,
  transfPathForWin,
  clearArrayOfStrings,
};
