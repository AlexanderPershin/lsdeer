const electron = require('electron');
const { exec } = require('child_process');
const os = require('os');
const { clearArrayOfStrings } = require('./helpersMain/helpers');

const formDirArrayWin = require('./helpersMain/formDirArrayWin');
const formDirArrayLinux = require('./helpersMain/formDirArrayLinux');
const checkFileAndOpen = require('./helpersMain/checkFileAndOpen');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    height: 600,
    width: 800,
  });

  const startUrl =
    process.env.ELECTRON_START_URL || `file://${__dirname}/build/index.html`;
  mainWindow.loadURL(startUrl);

  mainWindow.webContents.openDevTools();

  //enable garbage collector
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

ipcMain.on('ls-directory', (event, dirPath) => {
  const command = `ls "${dirPath}" -p --hide=*.sys --hide="System Volume Information" --group-directories-first`;

  try {
    const itWasFile = checkFileAndOpen(dirPath);
    if (itWasFile) return;

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      } else {
        let outputArray = [];
        const namesArray = clearArrayOfStrings(stdout.toString().split('\n'));

        if (os.platform() === 'win32') {
          outputArray = formDirArrayWin(namesArray, dirPath);
        } else {
          outputArray = formDirArrayLinux(namesArray, dirPath);
        }

        mainWindow.webContents.send('resp-dir', { response: outputArray });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

ipcMain.on('get-disks', (event) => {
  const command = `df -h`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    } else {
      mainWindow.webContents.send('resp-shelljs', {
        response: stdout.split('\n'),
      });
    }
  });
});

ipcMain.on('test', (event) => {
  mainWindow.webContents.send('test-response', { msg: 'test complete' });
});
