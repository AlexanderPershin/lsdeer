const path = require('path');
const { exec } = require('child_process');

const pasteUderNewName = (filePath, destDir, callback) => {
  // First find all copies in this folder
  let copyNum = 1;

  // TODO: find out if file or folder copied
  // Or maybe it should be done in index.js

  const fileExt = path.extname(filePath);
  const fileNameNoExt = path.basename(filePath, fileExt);

  try {
    exec(
      `find ${destDir} -name '${fileNameNoExt}(copy *)*'`,
      (error, stdout, stderr) => {
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
                .match(/\(copy \d\)/g)[0]
                .match(/\d/g)
            ) + 1;
        }

        const fileNewName = `${fileNameNoExt}(copy ${copyNum})${fileExt}`;

        exec(
          `cp -R ${filePath} '${destDir}${fileNewName}'`,
          (error, stdout, stderr) => {
            if (error) console.log(error);
            if (stderr) console.log(stderr);
            callback();
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = pasteUderNewName;
