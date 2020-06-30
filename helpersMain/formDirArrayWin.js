const path = require('path');
// const { transfPathForWin } = require('./helpers');

const formDirArrayWin = (namesArray, dirPath) => {
  let outputArray = namesArray.map((name) => {
    let isFile;

    if (name.charAt(name.length - 1) === '/') {
      isFile = false;
    } else {
      isFile = true;
    }

    newPath = dirPath.replace(':', ':/');

    return {
      name,
      path: path.win32.normalize(path.win32.join(newPath, name)),
      isFile,
      ext: path.win32.extname(
        path.win32.normalize(path.win32.join(newPath, name))
      ),
    };
  });
  outputArray = outputArray.filter((i) => i.name !== './' && i.name !== '../');
  console.log('formDirArrayWin -> outputArray', outputArray);
  return outputArray;
};

module.exports = formDirArrayWin;
