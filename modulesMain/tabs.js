const electron = require('electron');
const fs = require('fs');
// const path = require('path');
const { ipcMain } = electron;

const tabsSavePath = 'tabs.json';

// Allows to create/read/update/delete tabs in os explorer
module.exports = (mainWindow) => {
  ipcMain.on('new-tab', (event) => {
    mainWindow.webContents.send('new-tab-created');
  });

  ipcMain.on('close-current-tab', (event) => {
    mainWindow.webContents.send('current-tab-closed');
  });

  ipcMain.on('close-tab', (event, tabId, tabPath) => {
    mainWindow.webContents.send('closed-tab', {
      tabId,
      tabPath,
    });
  });

  // Save load/save tabs
  ipcMain.on('save-tabs', (event, tabs) => {
    // Remove all '/' paths for new tabs to avoid bug
    const tabsToSave = tabs.filter((item) => item.path !== '/');

    const tabsJson = JSON.stringify(tabsToSave);
    fs.writeFile(tabsSavePath, tabsJson, 'utf8', function (err) {
      if (err) {
        console.log('Error saving tabs.json');
        return console.log(err);
      }

      console.log('Tabs were saved into tabs.json');
    });
  });

  ipcMain.on('get-tabs', (event) => {
    fs.readFile(tabsSavePath, (err, data) => {
      if (err) {
        console.log(err);
        mainWindow.webContents.send('previous-tabs', { tabs: [] });
        return;
      }

      try {
        const tabsArray = JSON.parse(data);
        mainWindow.webContents.send('previous-tabs', { tabs: tabsArray });
      } catch (error) {
        console.log('error', error);
        mainWindow.webContents.send('previous-tabs', { tabs: [] });
      }
    });
  });
};
