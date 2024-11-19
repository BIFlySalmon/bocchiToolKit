const { ipcMain } = require('electron');

const { backgroundPageCreate } = require('../page/backgroundPage/bgPage');
const { WallpaperClose } = require('../dllCall/WallpaperSet');
// const storeManager = require('./storeManager.mjs');
let backgroundPage;

function initializeIpcHandlers(mainPage) {

    ipcMain.on('window-minimize', () => {
        mainPage.minimize();
    });

    ipcMain.on('window-maximize', () => {
        if (mainPage.isMaximized()) {
            mainPage.unmaximize();
        } else {
            mainPage.maximize();
        }
    });

    ipcMain.on('window-close', () => {
        mainPage.close();
    });

    ipcMain.on('restoreDesktop', () => {
        console.log('restoreDesktop()');//恢复桌面
        if (!(backgroundPage === null)){
            backgroundPage.close();
            WallpaperClose();
        }
    });

    ipcMain.on('createDesktop', () => {
        console.log('createDesktop()');
        backgroundPage = backgroundPageCreate();
    });
    
    /**
     * electron-store方法
     */
    // 获取某个设置项的值
    // ipcMain.handle('settings:get', (event, key) => {
    //     return storeManager.get(key);
    // });

    // // 设置某个设置项的值
    // ipcMain.handle('settings:set', (event, key, value) => {
    //     storeManager.set(key, value);
    // });

    // // 重置某个设置项到默认值
    // ipcMain.handle('settings:reset', (event, key) => {
    //     storeManager.reset(key);
    // });

    // // 重置所有设置项到默认值
    // ipcMain.handle('settings:resetAll', () => {
    //     storeManager.resetAll();
    // });

    // // 检查某个设置项是否存在
    // ipcMain.handle('settings:has', (event, key) => {
    //     return storeManager.has(key);
    // });

    // // 获取所有设置项
    // ipcMain.handle('settings:getAll', () => {
    //     return storeManager.getAll();
    // });


}

module.exports = { initializeIpcHandlers };
