const electron = require('electron');
const { ipcMain } = electron;

const createFile = require('../helpersMain/createFile');
const createFolder = require('../helpersMain/createFolder');

module.exports = (mainWindow) => {
  ipcMain.on('create-file-or-dir', () => {
    mainWindow.webContents.send('file-or-dir-created');
  });

  ipcMain.on('new-file', (event, dirPath, filename) => {
    createFile(dirPath, filename);
  });

  ipcMain.on('new-folder', (event, dirPath, foldername) => {
    createFolder(dirPath, foldername);
  });

  ipcMain.on('new-many', (event, dirPath, arrOfFilesFolders) => {
    try {
      arrOfFilesFolders.map((item) => {
        if (item.isFile) {
          createFile(dirPath, item.name);
        } else {
          createFolder(dirPath, item.name);
        }
      });
      console.log('Creation procedure complete');
    } catch (err) {
      console.log('Error creating many folders/files', err);
    }
  });

  ipcMain.on(
    'new-pattern',
    (event, dirPath, pattern, numOfItems, startingNum, areFiles) => {
      console.log(
        'dirPath, pattern, numOfItems, startingNum, areFiles',
        dirPath,
        pattern,
        numOfItems,
        startingNum,
        areFiles
      );

      // Parce pattern
      // Loop through numOfItems and create dirs
      if (!areFiles) {
        for (let i = startingNum; i <= numOfItems + startingNum; i++) {
          const itemName = pattern
            .replace(/\[num\]/g, i)
            .replace(/\[date\]/g, new Date().toLocaleDateString());

          createFolder(dirPath, itemName);
        }
      } else {
        for (let i = startingNum; i <= numOfItems + startingNum; i++) {
          const itemName = pattern
            .replace(/\[num\]/g, i)
            .replace(/\[date\]/g, new Date().toLocaleDateString());

          createFile(dirPath, itemName);
        }
      }
    }
  );
};
