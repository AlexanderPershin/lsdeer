const electron = require('electron');
const { exec } = require('child_process');
const os = require('os');
const http = require('http');
const cors = require('cors');
const express = require('express');
const expressApp = express();
const router = express.Router();

const ProgressBar = require('electron-progressbar');

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

    let hiddenDirs;
    const win32HiddenDirs = '--hide=*.sys --hide="System Volume Information"';
    const darwinHiddenDirs = '';
    if (process.platform === 'win32') {
      hiddenDirs = win32HiddenDirs;
    } else if (process.platform === 'darwin') {
      hiddenDirs = darwinHiddenDirs;
    }

    exec(
      `ls "${dirPath}" -Ap ${hiddenDirs} --group-directories-first`,
      (error, stdout, stderr) => {
        const namesArray = clearArrayOfStrings(stdout.toString().split('\n'));

        const progressBar = new ProgressBar({
          indeterminate: false,
          text: 'Preparing data...',
          detail: 'Copying data please wait...',
          maxValue: copiedFiles.length,
          browserWindow: {
            text: 'Preparing data...',
            detail: 'Wait...',
            webPreferences: {
              nodeIntegration: true,
            },
          },
          webPreferences: {
            nodeIntegration: true,
          },
        });

        console.log('Progr max val ', progressBar.getOptions().maxValue);

        progressBar
          .on('completed', function () {
            console.info(`completed...`);

            progressBar.detail = 'Task completed. Exiting...';
          })
          .on('aborted', function (value) {
            console.info(`aborted... ${value}`);
          })
          .on('progress', function (value) {
            progressBar.detail = `Value ${value} out of ${
              progressBar.getOptions().maxValue
            }...`;
          });

        let replaceAll = false;
        let noAll = false;

        copiedFiles.map((filename, i) => {
          console.log('progressBar.value', progressBar.value);

          const fileTrueName = filename.split('/').pop();

          if (namesArray.includes(fileTrueName)) {
            console.log('File with such name already there');

            let options = {
              buttons: ['Yes', 'No', 'Replace All', 'No All', 'Cancel'],
              message:
                'File with such name already exists, replace with new one?',
            };

            if (!replaceAll && !noAll) {
              const userChoise = dialog.showMessageBoxSync(options);
              switch (userChoise) {
                case 0:
                  exec(
                    `cp -R ${filename} ${dirPath}`,
                    (error, stdout, stderr) => {
                      console.log(`Copied ${filename} to ${dirPath}`);
                      progressBar.value += 1;
                      mainWindow.webContents.send('edit-action-complete');
                    }
                  );

                  break;
                case 1:
                  pasteUnderNewName(filename, dirPath, () => {
                    progressBar.value += 1;
                    mainWindow.webContents.send('edit-action-complete');
                  });

                  break;
                case 2:
                  replaceAll = true;
                  exec(
                    `cp -R ${filename} ${dirPath}`,
                    (error, stdout, stderr) => {
                      console.log(`Copied ${filename} to ${dirPath}`);
                      progressBar.value += 1;
                      mainWindow.webContents.send('edit-action-complete');
                    }
                  );

                  break;
                case 3:
                  noAll = true;
                  pasteUnderNewName(filename, dirPath, () => {
                    progressBar.value += 1;
                    mainWindow.webContents.send('edit-action-complete');
                  });

                  break;
                default:
                  return;
              }
            } else if (replaceAll) {
              exec(`cp -R ${filename} ${dirPath}`, (error, stdout, stderr) => {
                console.log(`Replaced ${filename} to ${dirPath}`);
                progressBar.value += 1;
                mainWindow.webContents.send('edit-action-complete');
              });
            } else if (noAll) {
              pasteUnderNewName(filename, dirPath, () => {
                progressBar.value += 1;
                mainWindow.webContents.send('edit-action-complete');
              });
            }

            return;
          }
          exec(`cp -R ${filename} ${dirPath}`, (error, stdout, stderr) => {
            console.log(`Copied ${filename} to ${dirPath}`);
            progressBar.value += 1;
            mainWindow.webContents.send('edit-action-complete');
          });
        });
        replaceAll = false;
        noAll = false;
      }
    );
  }
});

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

router.get('/video/:fullpath', async function (req, res) {
  let filePath = req.params.fullpath;
  console.log('Serving file:', filePath);

  res.sendFile(filePath);
});

expressApp.use('/', router);

http
  .createServer(expressApp)
  .listen(expressPort, () =>
    console.log(`Image server is up on port ${expressPort}`)
  );
