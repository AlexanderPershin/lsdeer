const fs = require('fs');
const path = require('path');

const createFile = (dirPath, filename) => {
  const creationPath = path.join(dirPath, filename);
  fs.writeFile(creationPath, '', (err, file) => {
    if (err) {
      console.log('createFile helper: Error creating file ', creationPath);
      return;
    } else {
      console.log('File created: ', creationPath);
    }
  });
};

module.exports = createFile;
