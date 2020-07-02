const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { ncp } = require('ncp');
ncp.limit = 16;

const pasteUderNewName = (filePath, destDir, callback) => {
  // First find all copies in this folder

  let copyNum = 1;
  let isFile;
  let fileExt;
  let fileNameNoExt;
  let destPath;

  const stats = fs.lstatSync(path.normalize(filePath), {}, (err, stats) => {
    if (err) console.log('pasteUnderNewName: Error determining file stats');
  });
  isFile = stats.isFile();
  if (isFile) fileExt = path.extname(filePath);
  fileNameNoExt = path.basename(filePath, fileExt);
  destPath =
    process.platform === 'win32'
      ? `${path.win32.normalize(destDir + '\\' + fileNameNoExt)}(copy-*)*`
      : `${path.normalize(destDir + '/' + fileNameNoExt)}(copy-*)*`;

  const find_command =
    process.platform === 'win32'
      ? `chcp 65001 | dir /S/B "${destPath}"`
      : `find ${destDir} -name '${destPath}'`;

  if (isFile) {
    // This is file and doesn't have (copy N) in it's name
    console.log('pasting copy of file');
    try {
      exec(find_command, (error, stdout, stderr) => {
        if (error) console.log(error);
        if (stderr) console.log(stderr);

        const existingCopies = stdout
          .toString()
          .split('\n')
          .filter((i) => i !== '');

        if (existingCopies && existingCopies.length > 0) {
          copyNum =
            parseInt(
              existingCopies[existingCopies.length - 1]
                .match(/\(copy-\d\)/g)[0]
                .match(/\d/g)
            ) + 1;
        }

        const fileNewName = `${fileNameNoExt}(copy-${copyNum})${fileExt}`;

        const destCopyPath =
          process.platform === 'win32'
            ? `${path.win32.normalize(destDir + '\\' + fileNewName)}`
            : `${path.normalize(destDir + '/' + fileNewName)}`;

        fs.copyFile(filePath, `${destCopyPath}`, (err) => {
          if (err) console.log('pasteUnderNewName: Error copying file!');
          callback();
        });
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log('Pasting renamed folder');
    try {
      exec(find_command, (error, stdout, stderr) => {
        if (error) console.log(error);
        if (stderr) console.log(stderr);

        const existingCopies = stdout
          .toString()
          .split('\n')
          .filter((i) => i !== '');

        if (existingCopies && existingCopies.length > 0) {
          copyNum =
            parseInt(
              existingCopies[existingCopies.length - 1]
                .match(/\(copy-\d\)/g)[0]
                .match(/\d/g)
            ) + 1;
        }

        // actually folder new name
        const fileNewName = `${fileNameNoExt}(copy-${copyNum})`;

        const destCopyPath =
          process.platform === 'win32'
            ? `${path.win32.normalize(destDir + '\\' + fileNewName)}`
            : `${path.normalize(destDir + '/' + fileNewName)}`;

        ncp(
          path.normalize(filePath),
          path.normalize(`${destCopyPath}`),
          function (err) {
            if (err) {
              return console.error(err);
            }
            callback();
          }
        );
      });
    } catch (error) {
      console.log('Error pasting folder ', error);
    }
  }
};

module.exports = pasteUderNewName;
