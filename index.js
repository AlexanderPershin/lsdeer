const electron = require('electron');

const { app, BrowserWindow } = electron;

const createWindow = () => {
  let mainWindow = new BrowserWindow({
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

  // Require all modules after mainWindow was created
  requireModules(mainWindow);

  mainWindow.webContents.openDevTools();

  //enable garbage collector
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.allowRendererProcessReuse = true;

app.on('ready', createWindow);

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

// Image Server
require('./imageServer');

process.on('uncaughtException', function (error) {
  // console.log('Uncought Exception on the main process', error);
});
