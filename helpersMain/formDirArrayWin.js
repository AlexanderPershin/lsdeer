const path = require('path');
const { transfPathForWin } = require('./helpers');

const formDirArrayWin = (namesArray, dirPath) => {
  const outputArray = namesArray.map((name) => {
    let isFile;

    if (name.charAt(name.length - 1) === '/') {
      isFile = false;
    } else {
      isFile = true;
    }

    return {
      name,
      path: path.normalize(path.join(dirPath, name)),
      isFile,
      ext: path.extname(path.normalize(path.join(dirPath, name))),
    };
  });

  return outputArray;
};

module.exports = formDirArrayWin;
