const { app, BrowserWindow } = require('electron');

const { createMainWindow } = require('./services/windowManager');
const { setupTray } = require('./services/trayManager');
const { initializeIpcHandlers } = require('./services/ipcHandlers');
const { quitApp } = require('./utils/appUtils');

let mainPage;
let tray;

app.whenReady().then(() => {
    mainPage = createMainWindow();
    tray = setupTray(mainPage, quitApp);
    initializeIpcHandlers(mainPage);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            mainPage = createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
