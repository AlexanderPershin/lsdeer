const path = require('path');
const { fileCheck, transfPathForWin } = require('./helpers');

const formDirArrayWin = (namesArray, dirPath) => {
  const newPath = transfPathForWin(dirPath);

  const outputArray = namesArray.map((name) => {
    let isFile;
    // try {
    //   isFile = fileCheck(newPath, name);
    // } catch (err) {
    //   console.log('Error determining file ext ', name);

    //   isFile = 'unknown';
    // }

    if (name.charAt(name.length - 1) === '/') {
      isFile = false;
    } else {
      isFile = true;
    }

    return {
      name,
      path: path.normalize(path.join(newPath, name)),
      isFile,
      ext: path.extname(path.normalize(path.join(newPath, name))),
    };
  });

  return outputArray;
};

module.exports = formDirArrayWin;
