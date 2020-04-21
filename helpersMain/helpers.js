const path = require('path');
const fs = require('fs');

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
