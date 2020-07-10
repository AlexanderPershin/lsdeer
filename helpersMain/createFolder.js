const fs = require('fs');
const path = require('path');

const createFolder = (dirPath, foldername) => {
  const creationPath = path.join(dirPath, foldername);
  fs.mkdir(creationPath, { recursive: true }, (err) => {
    if (err) {
      console.log('createFolder helper: Error creating file ', creationPath);
      return;
    } else {
      console.log('Folder created: ', creationPath);
    }
  });
};

module.exports = createFolder;
