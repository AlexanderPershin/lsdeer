const electron = require('electron');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');
const util = require('util');
const shell = require('electron').shell;

const { app, BrowserWindow, ipcMain } = electron;

const lstatProm = util.promisify(fs.lstat);

let mainWindow;

const createWindow = () => {
  // Install Redux/React dev tools
  // BrowserWindow.addDevToolsExtension(
  //   path.join(
  //     os.homedir(),
  //     '/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.6.0_0'
  //   )
  // );
  // BrowserWindow.addDevToolsExtension(
  //   path.join(
  //     os.homedir(),
  //     '/AppData/Local/Google/Chrome/User Data/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0'
  //   )
  // );

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

const fileCheck = (dirPath, name) => {
  return fs.lstatSync(path.normalize(path.join(dirPath, name))).isFile();
};

ipcMain.on('ls-directory', (event, dirPath) => {
  const command = `ls "${dirPath}"`;

  const transfPath = (dPath) => {
    const pathArr = dPath.split('/').filter((item) => item !== '');
    const drive = pathArr[0].toUpperCase() + ':';
    pathArr.shift();
    return path.normalize(path.join(drive, ...pathArr));
  };

  try {
    if (os.platform() === 'win32') {
      const newPath = transfPath(dirPath);

      const thisIsFile = fs.lstatSync(newPath).isFile();

      if (thisIsFile) {
        shell.openItem(newPath);
        return;
      }
    } else {
      const thisIsFile = fs.lstatSync(dirPath).isFile();
      if (thisIsFile) {
        shell.openItem(dirPath);
        return;
      }
    }

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      } else {
        let outputArray = [];
        const namesArray = stdout.toString().split('\n');
        if (os.platform() === 'win32') {
          const newPath = transfPath(dirPath);
          outputArray = namesArray.map((name) => {
            let isFile;
            try {
              isFile = fileCheck(newPath, name);
            } catch (err) {
              console.log('Error determining file ext ', name);
              const fileExt = path.extname(newPath);

              if (!fileExt) isFile = false;
            }

            return {
              name,
              path: path.normalize(path.join(newPath, name)),
              isFile,
              ext:
                isFile &&
                path.extname(path.normalize(path.join(newPath, name))),
            };
          });
        } else {
          outputArray = namesArray.map((name) => {
            let isFile;
            try {
              isFile = fs
                .lstatSync(path.normalize(path.join(dirPath, name)))
                .isFile();
            } catch {
              console.log('Error determining file ext ', name);

              const fileExt = path.extname(dirPath);

              if (!fileExt) isFile = false;
            }

            return {
              name,
              path: path.normalize(path.join(dirPath, name)),
              isFile,
              ext:
                isFile &&
                path.extname(path.normalize(path.join(dirPath, name))),
            };
          });
        }

        const clearArray = outputArray.filter((item) => item.name !== '');

        mainWindow.webContents.send('resp-dir', { response: clearArray });
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
