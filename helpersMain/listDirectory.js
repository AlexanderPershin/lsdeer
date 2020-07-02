const { readdir } = require('fs');
const path = require('path');

const naturalCompare = require('natural-compare');

const listDirectory = (dirPath, callback) => {
  try {
    const pathToRead =
      process.platform === 'win32'
        ? path.win32.normalize(dirPath)
        : path.normalize(dirPath);

    readdir(pathToRead, { withFileTypes: true }, (err, files) => {
      if (!files) callback([]);

      let dirArray = files.map((item) => {
        const itemIsFile = item.isFile();
        const itemPath =
          process.platform === 'win32'
            ? path.win32.join(pathToRead, item.name)
            : path.join(pathToRead, item.name);
        const itemExt = path.extname(item.name);

        return {
          name: item.name,
          path: itemPath,
          isFile: itemIsFile,
          ext: itemIsFile ? itemExt : undefined,
        };
      });

      // Sort by names
      const foldersSorted = dirArray
        .filter((i) => !i.isFile)
        .sort((a, b) => naturalCompare(a.name, b.name));
      const filesSorted = dirArray
        .filter((i) => i.isFile)
        .sort((a, b) => naturalCompare(a.name, b.name));
      // Group directories first
      const sortedDirArray = [...foldersSorted, ...filesSorted];

      callback(sortedDirArray);
    });
  } catch (err) {
    console.log(`listDirectory helper: Error listing directory ${pathToRead}`);
    callback([]);
  }
};

module.exports = listDirectory;
