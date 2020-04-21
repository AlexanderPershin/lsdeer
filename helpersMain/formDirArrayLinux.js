const path = require('path');
const { fileCheck } = require('./helpers');

const formDirArrayLinux = (namesArray, dirPath) => {
  const outputArray = namesArray.map((name) => {
    let isFile;
    try {
      isFile = fileCheck(dirPath, name);
    } catch {
      console.log('Error determining file ext ', name);

      const fileExt = path.extname(dirPath);

      if (!fileExt) isFile = false;
    }

    return {
      name,
      path: path.normalize(path.join(dirPath, name)),
      isFile,
      ext: isFile && path.extname(path.normalize(path.join(dirPath, name))),
    };
  });

  return outputArray;
};

module.exports = formDirArrayLinux;
