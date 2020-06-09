const electron = require('electron');
const fs = require('fs');
const { ipcMain } = electron;

// Allows to save/load favorites from json
module.exports = (mainWindow) => {
  ipcMain.on('add-to-favorites', (event, tabId) => {
    mainWindow.webContents.send('added-to-favorites', { tabId });
  });

  ipcMain.on('add-files-to-favorites', (event) => {
    mainWindow.webContents.send('selected-added-to-favs');
  });

  ipcMain.on('save-favs', (event, favorites) => {
    const favsJson = JSON.stringify(favorites);
    fs.writeFile('favorites.json', favsJson, 'utf8', function (err) {
      if (err) {
        console.log('Error saving favorites.json');
        return console.log(err);
      }

      console.log('Favorites were saved into favorites.json');
    });
  });

  ipcMain.on('get-favorites', (event) => {
    fs.readFile('favorites.json', (err, data) => {
      if (err) throw err;

      const favoritesArray = JSON.parse(data);

      mainWindow.webContents.send('previous-favorites', {
        favorites: favoritesArray,
      });
    });
  });
};
