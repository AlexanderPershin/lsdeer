const electron = require('electron');
const fs = require('fs');
const { ipcMain } = electron;
const getColors = require('get-image-colors');

// Allows to open path: newPath in tab with id: tabId
module.exports = (mainWindow) => {
  ipcMain.on('save-settings', (event, settings) => {
    const settingsJson = JSON.stringify(settings);
    fs.writeFile('settings.json', settingsJson, 'utf8', function (err) {
      if (err) {
        console.log('Error saving settings.json');
        return console.log(err);
      }

      console.log('Settings were saved into settings.json');
    });
  });

  ipcMain.on('apply-settings-event', (event) => {
    mainWindow.webContents.send('apply-settings');
  });

  ipcMain.on('get-settings', (event) => {
    fs.readFile('settings.json', (err, data) => {
      if (err) throw err;

      const settingsArray = JSON.parse(data);

      mainWindow.webContents.send('previous-settings', {
        settings: settingsArray,
      });
    });
  });

  ipcMain.on('open-settings', (event) => {
    mainWindow.webContents.send('settings-opened');
  });

  ipcMain.on('reset-settings-to-default', (event) => {
    console.log("'reset-settings-to-default'", 'reset-settings-to-default');
    mainWindow.webContents.send('settings-dropped');
  });

  ipcMain.on('extract-colors', (event, imagePath) => {
    const options = {
      count: 7,
    };

    getColors(imagePath, options)
      .then((colors) => {
        mainWindow.webContents.send('extracted-colors', {
          colors,
          error: false,
        });
      })
      .catch((err) => {
        mainWindow.webContents.send('extracted-colors', {
          colors: null,
          error: true,
        });
      });
  });
};
