const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { ncp } = require('ncp');
ncp.limit = 16;

const pasteUderNewName = (filePath, destDir, callback) => {
  // First find all copies in this folder
  let copyNum = 1;

  const fileExt = path.extname(filePath);
  let fileNameNoExt = path.basename(filePath, fileExt);

  const find_command =
    process.platform === 'win32'
      ? `chcp 65001 | dir /S/B "${path.win32.normalize(
          destDir + fileNameNoExt
        )}(copy-*)*"`
      : `find ${destDir} -name '${fileNameNoExt}(copy-*)*'`;

  if (fileExt) {
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

        fs.copyFile(filePath, `${destDir}${fileNewName}`, (err) => {
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

        console.log('pasteUderNewName -> existingCopies', existingCopies);

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

        if (process.platform === 'win32') {
          ncp(
            path.win32.normalize(filePath),
            path.win32.normalize(`${destDir}${fileNewName}`),
            function (err) {
              console.log(
                'pasteUderNewName -> filePath, `${destDir}${fileNewName}`',
                filePath,
                `${destDir}${fileNewName}`
              );
              if (err) {
                return console.error(err);
              }
              callback();
            }
          );
        } else {
          ncp(filePath, `${destDir}${fileNewName}`, function (err) {
            console.log(
              'pasteUderNewName -> filePath, `${destDir}${fileNewName}`',
              filePath,
              `${destDir}${fileNewName}`
            );
            if (err) {
              return console.error(err);
            }
            callback();
          });
        }
      });
    } catch (error) {
      console.log('Error pasting folder ', error);
    }
  }
};

module.exports = pasteUderNewName;
