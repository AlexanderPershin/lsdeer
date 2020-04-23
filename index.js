const electron = require('electron');
const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { clearArrayOfStrings } = require('./helpersMain/helpers');

const formDirArrayWin = require('./helpersMain/formDirArrayWin');
const formDirArrayLinux = require('./helpersMain/formDirArrayLinux');
const checkFileAndOpen = require('./helpersMain/checkFileAndOpen');
const pasteUnderNewName = require('./helpersMain/pasteUnderNewName');

const {
  selectAllHandler,
  copyHandler,
  pasteHandler,
  deleteHandler,
} = require('./helpersMain/shortCutHandlers/globalShortCutHandlers');

const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  globalShortcut,
  clipboard,
  dialog,
} = electron;

let mainWindow;

let copiedFiles = [];

const createWindow = () => {
  // globalShortcut.register('CommandOrControl+A', selectAllHandler);
  // globalShortcut.register('CommandOrControl+C', copyHandler);
  // globalShortcut.register('CommandOrControl+V', pasteHandler);
  // globalShortcut.register('delete', deleteHandler);

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

ipcMain.on('copied-file', (event, dirPath, namesArray) => {
  copiedFiles = [];
  namesArray.map((name) => copiedFiles.push(dirPath + name));
  console.log('Copied Files ', copiedFiles);
});

ipcMain.on('pasted-file', (event, dirPath) => {
  if (copiedFiles.length > 0) {
    // TODO: refactor this code into a function
    // send event when dialog window closed to refresh page with files
    exec(
      `ls "${dirPath}" -p --hide=*.sys --hide="System Volume Information" --group-directories-first`,
      (error, stdout, stderr) => {
        const namesArray = clearArrayOfStrings(stdout.toString().split('\n'));
        console.log('namesArray', namesArray);

        copiedFiles.map((filename, i) => {
          console.log('filename ', filename);
          const fileTrueName = filename.split('/').pop();
          console.log('fileTrueName', fileTrueName);

          if (namesArray.includes(fileTrueName)) {
            console.log('File with such name already there');
            console.log('dirPath ', dirPath);

            // let opts = {
            //   title: 'File with such name already exists',
            //   defaultPath: dirPath + fileTrueName,
            //   filters: [
            //     {
            //       name: 'Allowed extensions',
            //       extensions: [path.extname(fileTrueName).substr(1)],
            //     },
            //   ],
            //   buttonLabel: 'Save',
            // };

            // const newPath = dialog.showSaveDialogSync(mainWindow, opts);

            let options = {
              buttons: ['Yes', 'No', 'Cancel'],
              message:
                'File with such name already exists, replace with new one?',
            };

            // userChoise 0 - Yes, 1 - No, 2 - Cancel
            const userChoise = dialog.showMessageBoxSync(options);

            if (userChoise === 0) {
              exec(`cp -R ${filename} ${dirPath}`, (error, stdout, stderr) => {
                console.log(`Copied ${filename} to ${dirPath}`);
                mainWindow.webContents.send('file-was-pasted');
              });
            } else if (userChoise === 1) {
              // TODO: save file under filename(1).ext name
              // find a way to count and increase (number) on file rename
              pasteUnderNewName(filename, dirPath, () => {
                mainWindow.webContents.send('file-was-pasted');
              });
            }

            return;
          }
          exec(`cp -R ${filename} ${dirPath}`, (error, stdout, stderr) => {
            console.log(`Copied ${filename} to ${dirPath}`);
            mainWindow.webContents.send('file-was-pasted');
          });
        });
      }
    );
  }
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
        accelerator: 'CommandOrControl+shift+A',
        click(e) {
          // selectAllHandler(e);
          mainWindow.webContents.send('select-all');
        },
      },
      {
        label: 'Copy',
        accelerator: 'CommandOrControl+shift+C',
        click(e) {
          // copyHandler(e);
          mainWindow.webContents.send('copy-to-clipboard');
        },
      },
      {
        label: 'Paste',
        accelerator: 'CommandOrControl+shift+V',
        click(e) {
          // pasteHandler(e);
          mainWindow.webContents.send('paste-from-clipboard');
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
  {
    label: 'View',
    submenu: [
      {
        label: 'Open DevTools',
        accelerator: 'CommandOrControl+`',
        click(e) {
          mainWindow.webContents.openDevTools();
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
