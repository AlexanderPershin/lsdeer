const electron = require('electron');
const { ipcMain } = electron;

module.exports = (mainWindow) => {
  ipcMain.on('test', (event) => {
    console.log('** test test test **');

    mainWindow.webContents.send('test-response', { msg: 'test complete' });
  });
};
