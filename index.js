const electron = require('electron');
const { exec } = require('child_process');
const os = require('os');
const { clearArrayOfStrings } = require('./helpersMain/helpers');

const formDirArrayWin = require('./helpersMain/formDirArrayWin');
const formDirArrayLinux = require('./helpersMain/formDirArrayLinux');
const checkFileAndOpen = require('./helpersMain/checkFileAndOpen');

const {
  selectAllHandler,
  copyHandler,
  pasteHandler,
  deleteHandler,
} = require('./helpersMain/shortCutHandlers/shortCutHandlers');

const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = electron;

let mainWindow;

const createWindow = () => {
  globalShortcut.register('CommandOrControl+A', selectAllHandler);
  globalShortcut.register('CommandOrControl+C', copyHandler);
  globalShortcut.register('CommandOrControl+V', pasteHandler);
  globalShortcut.register('delete', deleteHandler);

  Menu.setApplicationMenu(applicationMenu);

  mainWindow = new BrowserWindow({
    title: 'lsdeer',
    icon: __dirname + '/appAssets/Renna.png',
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

// TODO: create universal command to remove files and folders array
ipcMain.on('delete-dir', (event, dirPath) => {
  // Remove folder
  const command = `rmdir ${dirPath}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    } else {
      mainWindow.webContents.send('delete-dir-resp', {
        response: true,
      });
    }
  });
});

ipcMain.on('delete-file', (event, dirPath) => {
  // Remove file
  const command = `rm ${dirPath}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    } else {
      mainWindow.webContents.send('delete-file-resp', {
        response: true,
      });
    }
  });
});

ipcMain.on('test', (event) => {
  mainWindow.webContents.send('test-response', { msg: 'test complete' });
});

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Save File',
        accelerator: 'CommandOrControl+S',
        click() {
          console.log('Save command');

          // mainWindow.webContents.send('save-markdown');
        },
      },
      {
        label: 'Quit',
        accelerator: 'CommandOrControl+Q',
        click() {
          app.quit();
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Select All',
        accelerator: 'CommandOrControl+A',
        click(e) {
          selectAllHandler(e);
        },
      },
      {
        label: 'Copy',
        accelerator: 'CommandOrControl+C',
        click(e) {
          copyHandler(e);
        },
      },
      {
        label: 'Paste',
        accelerator: 'CommandOrControl+V',
        click(e) {
          pasteHandler(e);
        },
      },
      {
        label: 'Delete',
        accelerator: 'delete',
        click(e) {
          deleteHandler(e);
        },
      },
    ],
  },
];

if (process.platform === 'darwin') {
  const applicationName = 'Lsdeer';
  template.unshift({
    label: applicationName,
    submenu: [
      {
        label: `About ${applicationName}`,
      },
      {
        label: `Quit ${applicationName}`,
        click() {
          app.quit();
        },
      },
    ],
  });
}

const applicationMenu = Menu.buildFromTemplate(template);
