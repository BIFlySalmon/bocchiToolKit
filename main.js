const { app, BrowserWindow } = require('electron');

const { createMainWindow } = require('./services/windowManager');
const { setupTray } = require('./services/trayManager');
const { initializeIpcHandlers } = require('./services/ipcHandlers');
const { quitApp } = require('./utils/appUtils');

const gotTheLock = app.requestSingleInstanceLock()
let mainPage;
let tray;

app.whenReady().then(() => {
    //防止程序多开
    if (!gotTheLock) {
        quitApp();
    }
    //设置开机自启应用工作路径
    // if (app.isPackaged) {
    //     process.chdir(process.resourcesPath);
    //     process.chdir('..');
    // }
    
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

// 禁用window.open打开窗口
app.on('web-contents-created', (e, webContents) => {
    // 禁用window.open打开窗口
    webContents.setWindowOpenHandler((details) => {
        console.log(details.url);
        webContents.loadURL(details.url);
        return { action: 'deny' }
    })
});