const electron = require('electron');

const { app, BrowserWindow, dialog } = electron;
const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const fixPath = require('fix-path');

fixPath();

const requireModules = (mainWindow) => {
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
  require('./modulesMain/favorites')(mainWindow);
  require('./modulesMain/settings')(mainWindow);
  require('./modulesMain/testModule')(mainWindow);
};

const createWindow = () => {
  let mainWindow = new BrowserWindow({
    title: 'lsdeer',
    icon: __dirname + '/appAssets/deer-icon.png',
    webPreferences: {
      nodeIntegration: true,
    },
    height: 600,
    width: 800,
    frame: false,
    show: false,
  });

  const startUrl =
    process.env.ELECTRON_START_URL || `file://${__dirname}/build/index.html`;
  mainWindow.loadURL(startUrl);

  // Require all modules after mainWindow was created
  requireModules(mainWindow);

  mainWindow.webContents.openDevTools();

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  //enable garbage collector
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.allowRendererProcessReuse = true;

app.on('ready', createWindow);

app.whenReady().then(() => {
  installExtension(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));

})


// Image Server
require('./imageServer');

process.on('uncaughtException', function (error) {
  console.log('Uncought Exception on the main process', error);
});
