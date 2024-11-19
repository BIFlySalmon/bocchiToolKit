const { ipcMain, dialog} = require('electron');
const { backgroundPageCreate} = require('./wallpaperServer');
const { WallpaperClose } = require('../dllCall/WallpaperSet');
const { storeManager } = require('./storeManager');
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
        if (!(backgroundPage == null)){
            backgroundPage.close();
            WallpaperClose();
        }
    });

    ipcMain.on('createDesktop', () => {
        backgroundPage = backgroundPageCreate();

    });

    ipcMain.handle('dialog:openFile', async (evnet, selectedType) => {
        const result = await dialog.showOpenDialog(mainPage, {
            title: '选择文件',
            properties: ['openFile'], // 仅允许选择文件
            filters: [
                // { name: '所有文件', extensions: ['*'] },
                selectedType == 'img'
                ?
                { name: '图片文件', extensions: ['png', 'jpg', 'jpeg', 'gif'] }
                :
                { name: '视频文件', extensions: ['mp4', 'mkv', 'avi'] }
            ],
        });
        return result.canceled ? null : result.filePaths[0]; // 返回文件路径或 null
    })
    
    /**
     * electron-store方法
     */

    // 获取某个设置项的值
    ipcMain.on('settings:get', (event, key) => {
        event.returnValue = storeManager.get(key); // 返回同步消息
    });

    // 设置某个设置项的值
    ipcMain.on('settings:set', (event, key, value) => {
        storeManager.set(key, value);
    });

    // 重置某个设置项到默认值
    ipcMain.on('settings:reset', (event, key) => {
        storeManager.reset(key);
    });

    // 重置所有设置项到默认值
    ipcMain.on('settings:resetAll', () => {
        storeManager.resetAll();
    });

    // 检查某个设置项是否存在
    ipcMain.on('settings:has', (event, key) => {
        event.returnValue = storeManager.has(key);
    });

    // 获取所有设置项
    ipcMain.on('settings:getAll', (event) => {
        event.returnValue = storeManager.getAll();
    });


}

module.exports = { initializeIpcHandlers };
