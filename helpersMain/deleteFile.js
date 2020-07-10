const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = (fullpath) => {
  fs.rmdir(path.normalize(fullpath), { recursive: true }, (err) => {
    if (err) {
      console.log('deleteFile module: Error deleting file ', fullpath);
    }
  });
};
