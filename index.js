const electron = require('electron');
const { exec } = require('child_process');
const os = require('os');
const http = require('http');
const cors = require('cors');
const express = require('express');
const expressApp = express();
const router = express.Router();

const imageThumbnail = require('image-thumbnail');

const { clearArrayOfStrings } = require('./helpersMain/helpers');

const formDirArrayWin = require('./helpersMain/formDirArrayWin');
const formDirArrayLinux = require('./helpersMain/formDirArrayLinux');
const checkFileAndOpen = require('./helpersMain/checkFileAndOpen');
const pasteUnderNewName = require('./helpersMain/pasteUnderNewName');

const { app, BrowserWindow, ipcMain, dialog } = electron;

let mainWindow;

let copiedFiles = [];

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

  mainWindow.webContents.openDevTools();

  //enable garbage collector
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

ipcMain.on('ls-directory', (event, dirPath, tabId) => {
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

        mainWindow.webContents.send('resp-dir', {
          response: outputArray,
          tabId,
          newPath: dirPath,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

ipcMain.on('open-directory', (event, tabId, newPath) => {
  mainWindow.webContents.send('directory-opened', {
    tabId,
    newPath,
  });
});

// Tabs menu ===================================
ipcMain.on('new-tab', (event) => {
  mainWindow.webContents.send('new-tab-created');
});

ipcMain.on('close-current-tab', (event) => {
  mainWindow.webContents.send('current-tab-closed');
});
// Tabs menu end ===============================

ipcMain.on('get-drives', (event) => {
  const command = `df -h`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    } else {
      mainWindow.webContents.send('drives-response', {
        response: stdout.split('\n'),
      });
    }
  });
});

// Edit menu ==================================
ipcMain.on('select-all', (event) => {
  mainWindow.webContents.send('all-files-selected');
});

ipcMain.on('copy-files', (event) => {
  mainWindow.webContents.send('copy-to-clipboard');
});

ipcMain.on('paste-files', (event) => {
  mainWindow.webContents.send('paste-from-clipboard');
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

// TODO: works incorrectly
// paste and rename simillar files silently like in windows file explorer
ipcMain.on('pasted-file', (event, dirPath) => {
  if (copiedFiles.length > 0) {
    console.log(`Files ${copiedFiles} pasted to ${dirPath}`);
    const command = `ls "${dirPath}" -p --hide=*.sys --hide="System Volume Information" --group-directories-first`;

    const copiedFilesNames = copiedFiles.map((item) => {
      const itemArr = item.split('/');
      return itemArr[itemArr.length - 1] === ''
        ? itemArr[itemArr.length - 2] + '/'
        : itemArr[itemArr.length - 1];
    });
    console.log('copiedFilesNames', copiedFilesNames);
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

        copiedFilesNames.map((item, idx) => {
          if (namesArray.includes(item)) {
            console.log(`File ${item} already exists in ${dirPath}`);
            pasteUnderNewName(copiedFiles[idx], dirPath, () => {
              mainWindow.webContents.send('edit-action-complete', {
                dirPath,
              });
            });
          } else {
            console.log(`File ${item} will be first in ${dirPath}`);
            exec(
              `cp -R \"${copiedFiles[idx]}\" \"${dirPath}${item}\"`,
              (error, stdout, stderr) => {
                if (error) console.log(error);
                if (stderr) console.log(stderr);
                mainWindow.webContents.send('edit-action-complete', {
                  dirPath,
                });
              }
            );
          }
        });
      }
    });
  }
});
// Edit menu end===============================

expressApp.use(cors());
const expressPort = 15032;

// Thumbnails for images
router.get('/file/:fullpath', async function (req, res) {
  let filePath = req.params.fullpath;
  console.log('Serving file:', filePath);

  let options = { width: 150, height: 100, percentage: 5 };

  try {
    const thumbnail = await imageThumbnail(filePath, options);
    res.send(thumbnail);
  } catch (err) {
    console.error(err);
    // Send full image on error: may be performance demanding
    res.sendFile(filePath);
  }
});

expressApp.use('/', router);

http
  .createServer(expressApp)
  .listen(expressPort, () =>
    console.log(`Image server is up on port ${expressPort}`)
  );
