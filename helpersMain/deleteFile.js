const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = (fullpath) => {
  fs.rmdirSync(path.normalize(fullpath), { recursive: true });
};
