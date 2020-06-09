const electron = require('electron');
const fs = require('fs');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    title: 'lsdeer',
    icon: __dirname + '/appAssets/Renna.png',
    webPreferences: {
      nodeIntegration: true,
    },
    height: 600,
    width: 800,
    frame: false,
  });

  const startUrl =
    process.env.ELECTRON_START_URL || `file://${__dirname}/build/index.html`;
  mainWindow.loadURL(startUrl);

  requireModules();

  mainWindow.webContents.openDevTools();

  //enable garbage collector
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.allowRendererProcessReuse = true;

app.on('ready', createWindow);

// TODO: Split index's code into modules and put their import into requireModules function
// Require all modules after mainWindow created
const requireModules = () => {
  require('./modulesMain/ls')(mainWindow);
  require('./modulesMain/open')(mainWindow);
  require('./modulesMain/openInExplorer')(mainWindow);
  require('./modulesMain/tabs')(mainWindow);
  require('./modulesMain/drives')(mainWindow);
  require('./modulesMain/selectAll')(mainWindow);
  require('./modulesMain/delete')(mainWindow);
  require('./modulesMain/copyPaste')(mainWindow);
  require('./modulesMain/find')(mainWindow);
  require('./modulesMain/toggleInterface')(mainWindow);
  require('./modulesMain/watchers')(mainWindow);

  require('./modulesMain/testModule')(mainWindow);
};

// USER DATA LISTENERS
ipcMain.on('save-tabs', (event, tabs) => {
  // Remove all '/' paths for new tabs to avoid bug
  const tabsToSave = tabs.filter((item) => item.path !== '/');

  const tabsJson = JSON.stringify(tabsToSave);
  fs.writeFile('tabs.json', tabsJson, 'utf8', function (err) {
    if (err) {
      console.log('Error saving tabs.json');
      return console.log(err);
    }

    console.log('Tabs were saved into tabs.json');
  });
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

ipcMain.on('get-tabs', (event) => {
  fs.readFile('tabs.json', (err, data) => {
    if (err) throw err;

    const tabsArray = JSON.parse(data);

    mainWindow.webContents.send('previous-tabs', { tabs: tabsArray });
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

ipcMain.on('get-settings', (event) => {
  fs.readFile('settings.json', (err, data) => {
    if (err) throw err;

    const settingsArray = JSON.parse(data);

    mainWindow.webContents.send('previous-settings', {
      settings: settingsArray,
    });
  });
});

ipcMain.on('add-to-favorites', (event, tabId) => {
  mainWindow.webContents.send('added-to-favorites', { tabId });
});

ipcMain.on('add-files-to-favorites', (event) => {
  mainWindow.webContents.send('selected-added-to-favs');
});

ipcMain.on('open-settings', (event) => {
  mainWindow.webContents.send('settings-opened');
});

ipcMain.on('reset-settings-to-default', (event) => {
  console.log("'reset-settings-to-default'", 'reset-settings-to-default');
  mainWindow.webContents.send('settings-dropped');
});
// USER DATA LISTENERS END

// Image Server
require('./imageServer');

process.on('uncaughtException', function (error) {
  // console.log('Uncought Exception on the main process', error);
});
