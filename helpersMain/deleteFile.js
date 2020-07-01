const { exec } = require('child_process');
const path = require('path');

module.exports = (fullpath) => {
  const command_win_file = `del "${path.win32.normalize(fullpath)}"`;
  const command_win_dir = `rmdir /S/Q "${path.win32.normalize(fullpath)}"`;
  const command_unix = `rm -r "${fullpath}"`;

  if (process.platform === 'win32') {
    if (fullpath.substr(-1, 1) === '/') {
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
