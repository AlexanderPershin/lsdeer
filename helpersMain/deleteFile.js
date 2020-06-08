const { exec } = require('child_process');

module.exports = (fullpath) => {
  const command = `rm -r "${fullpath}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    } else {
      console.log('File deleted', fullpath);
    }
  });
};
