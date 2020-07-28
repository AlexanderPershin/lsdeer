const electron = require('electron');
const { ipcMain } = electron;
const { autoUpdater } = require('electron-updater');

// Updating app
module.exports = (mainWindow) => {
  autoUpdater.checkForUpdates();

  const sendStatusToWindow = (text) => {
    console.log(text);
    if (mainWindow) {
      mainWindow.webContents.send('message', text);
    }
  };

  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
  });
  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
  });
  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
  });
  autoUpdater.on('error', (err) => {
    sendStatusToWindow(`Error in auto-updater: ${err.toString()}`);
  });
  autoUpdater.on('download-progress', (progressObj) => {
    sendStatusToWindow(
      `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total} + )`
    );
  });
  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded; will install now');
  });

  autoUpdater.on('update-downloaded', (info) => {
    // Wait 5 seconds, then quit and install
    // In your application, you don't need to wait 500 ms.
    // You could call autoUpdater.quitAndInstall(); immediately
    autoUpdater.quitAndInstall();
  });
};
