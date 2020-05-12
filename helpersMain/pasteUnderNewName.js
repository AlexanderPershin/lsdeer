const path = require('path');
const { exec } = require('child_process');

const pasteUderNewName = (filePath, destDir, callback) => {
  // First find all copies in this folder
  let copyNum = 1;

  const fileExt = path.extname(filePath);
  let fileNameNoExt = path.basename(filePath, fileExt);

  if (fileExt) {
    // This is file and doesn't have (copy N) in it's name
    console.log('pasting copy of file');
    try {
      exec(
        `find ${destDir} -name '${fileNameNoExt}(copy-*)*'`,
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
                  .match(/\(copy-\d\)/g)[0]
                  .match(/\d/g)
              ) + 1;
          }

          const fileNewName = `${fileNameNoExt}(copy-${copyNum})${fileExt}`;

          // Check changed filepath uses ', whilde destdir uses " - this should work!!!
          exec(
            `cp -R \"${filePath}\" \"${destDir}${fileNewName}\"`,
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
  } else {
    console.log('Pasting renamed folder');
    try {
      exec(
        `find ${destDir} -name '${fileNameNoExt}(copy-*)'`,
        (error, stdout, stderr) => {
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
          console.log('pasteUderNewName -> fileNewName', fileNewName);

          exec(
            `cp -R \"${filePath}\" \"${destDir}${fileNewName}\"`,
            (error, stdout, stderr) => {
              if (error) console.log(error);
              if (stderr) console.log(stderr);
              callback();
            }
          );
        }
      );
    } catch (error) {
      console.log('Error pasting folder ', error);
    }
  }
};

module.exports = pasteUderNewName;
