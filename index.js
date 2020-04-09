const electron = require('electron');
const shell = require('shelljs');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');

const { app, BrowserWindow, ipcMain } = electron;

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

  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
  }

  //enable garbage collector
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

ipcMain.on('ls-directory', (event, path) => {
  const command = `ls ${path}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      mainWindow.webContents.send('resp-shelljs', { response: stdout });
    }
  });
});

ipcMain.on('get-disks', (event) => {
  const command = `df -h`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      mainWindow.webContents.send('resp-shelljs', {
        response: stdout.split('\n'),
      });
    }
  });
});
