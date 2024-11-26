const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

log.transports.file.level = 'info';
autoUpdater.logger = log;

const { wallpaperRefresh } = require('./services/wallpaperServer');
const { createMainWindow, deleteFolderAndContents } = require('./services/windowManager');
const { setupTray } = require('./services/trayManager');
const { initializeIpcHandlers } = require('./services/ipcHandlers');
const { quitApp, updateToRestart } = require('./utils/appUtils');
const { registerShortcuts } = require('./services/shortcutKeyManager');
const { startScreenShots } = require('./services/printScreen');
const { refreshWindows } = require('./services/posterGirlManager');
const { storeManager } = require('./services/storeManager');

const gotTheLock = app.requestSingleInstanceLock()
let mainPage;
let tray;
app.commandLine.appendSwitch('lang', 'zh-CN');

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
    storeManager.set('onceNotification', false);
    mainPage = createMainWindow();
    tray = setupTray(mainPage, quitApp);
    initializeIpcHandlers(mainPage);
    startScreenShots();
    registerShortcuts(); //注册快捷键
    refreshWindows();
    
    // 自动更新检查
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('update-available', (info) => {
        log.info('Update available:', info);
        // mainPage.webContents.send('update_available');
    });

    autoUpdater.on('update-downloaded', async (info) => {
        log.info('Update downloaded:', info);
        // mainPage.webContents.send('update_downloaded');
        const result = await dialog.showMessageBox(mainPage, {
            type: 'question',
            buttons: ['确定', '取消'], 
            defaultId: 0, 
            cancelId: 1, 
            title: '确认更新',
            message: "更新已下载，是否立即重启应用以完成更新？（这可能需要一分钟）",
        });
        console.log(result.response);
        if (result.response === 0){
            console.log("updatetorestart");
            updateToRestart();
        }
    });

    autoUpdater.on('error', (err) => {
        log.error('Update error:', err);
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            mainPage = createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    app.quit();
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