const { ipcMain } = require('electron');
const { wallpaperRefresh, refreshMute} = require('./wallpaperServer');
const { storeManager } = require('./storeManager');
const { setAutoLaunch, isAutoLaunchEnabled } = require('./autoLaunch');
const { wallpaperFileSelect } = require('./fileManager');
const { executeBat } = require('./batManager');


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

    // ipcMain.on('restoreDesktop', () => {
    //     backgroundPage = wallpaperClose();
    // });

    // ipcMain.on('createDesktop', () => {
    //     backgroundPage = backgroundPageCreate();
    // });

    ipcMain.on('wallpaperRefresh', () => {
        backgroundPage = wallpaperRefresh();
    });

    ipcMain.handle('dialog:openFile', async (evnet, selectedType) => {
        return await wallpaperFileSelect(mainPage,selectedType);
    });

    //执行bat脚本
    ipcMain.on('execute-bat', () => {
        executeBat();
    });
    
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



    // 处理自启动IPC请求
    ipcMain.handle('set-auto-launch', (event, enable) => {
        setAutoLaunch(enable);
    });

    ipcMain.handle('get-auto-launch-status', () => {
        return isAutoLaunchEnabled();
    });


    ipcMain.on('refreshMute', () => {
        refreshMute();
        // backgroundPage.webContents.send('refreshMute', { data: storeManager.get('mute') });
    });
}

module.exports = { initializeIpcHandlers };
