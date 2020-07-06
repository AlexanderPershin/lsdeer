const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = (fullpath) => {
  const command_win_file = `del "${path.win32.normalize(fullpath)}"`;
  const command_win_dir = `rmdir /S/Q "${path.win32.normalize(fullpath)}"`;
  const command_unix = `rm -r "${fullpath}"`;

  const isFile = fs.lstatSync(path.normalize(fullpath)).isFile();

  if (process.platform === 'win32') {
    if (!isFile) {
      // this is folder
      exec(command_win_dir, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Folder deleted', fullpath);
        }
      });
    } else {
      // this is file
      exec(command_win_file, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
        } else {
          console.log('File deleted', fullpath);
        }
      });
    }
  } else {
    exec(command_unix, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      } else {
        console.log('File deleted', fullpath);
      }
    });
  }
};
