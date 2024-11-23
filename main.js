const { app, BrowserWindow } = require('electron');

const { wallpaperRefresh } = require('./services/wallpaperServer');
const { createMainWindow, deleteFolderAndContents } = require('./services/windowManager');
const { setupTray } = require('./services/trayManager');
const { initializeIpcHandlers } = require('./services/ipcHandlers');
const { quitApp } = require('./utils/appUtils');
const { registerShortcuts } = require('./services/shortcutKeyManager');
const { startScreenShots } = require('./services/printScreen');
const { refreshWindows } = require('./services/posterGirlManager');

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
    
    wallpaperRefresh(); //优先启动壁纸，优化自启动体验
    mainPage = createMainWindow();
    tray = setupTray(mainPage, quitApp);
    initializeIpcHandlers(mainPage);
    startScreenShots();
    registerShortcuts(); //注册快捷键
    refreshWindows();
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
    });

    app.on('before-quit', (event) => {
        deleteFolderAndContents();
    });

});