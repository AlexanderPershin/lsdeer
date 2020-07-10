const electron = require('electron');
const { ipcMain } = electron;

const path = require('path');
const fs = require('fs');

module.exports = (mainWindow) => {
  ipcMain.on('trigger-rename-selected', (event) => {
    mainWindow.webContents.send('rename-selected');
  });

  ipcMain.on('rename', (event, dirPath, fileName, newFileName) => {
    // Rename here
    const oldPath = path.join(dirPath, fileName);
    const newPath = path.join(dirPath, newFileName);
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.log('Error renaming file', fileName);
        return;
      }
      console.log('Rename complete!');
    });
  });

  ipcMain.on('rename-many', (event, dirPath, fileNames, pattern, starting) => {
    console.log('dirPath, fileNames, pattern', dirPath, fileNames, pattern);
    for (let i = 0; i < fileNames.length; i++) {
      const oldPath = path.join(dirPath, fileNames[i]);
      // Check if file
      let fileName = fileNames[i];
      let ext = '';
      const isFile = fs.lstatSync(oldPath).isFile();

      if (isFile) {
        ext = path.extname(fileName);
        fileName = fileName.replace(ext, '');
      }

      let newFileName = pattern
        .replace(/\[num\]/g, i + starting)
        .replace(/\[name\]/g, fileName)
        .replace(/\[date\]/g, new Date().toLocaleDateString());

      if (isFile && ext) {
        newFileName = newFileName + ext;
      }
      const newPath = path.join(dirPath, newFileName);

      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.log('Error renaming file', fileName);
          return;
        }
        console.log('Rename complete!');
      });
    }
  });
};
