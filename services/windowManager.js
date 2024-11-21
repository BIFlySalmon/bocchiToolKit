const { BrowserWindow, dialog } = require('electron');
const path = require('node:path');
const { getQuitFlag } = require('../utils/appUtils');
const isAutoStart = process.argv.includes('-autoLaunch');

function createMainWindow() {
    const mainPage = new BrowserWindow({
        width: 1000,
        height: 600,
        minWidth: 472,
        minHeight: 350,
        frame: false,
        icon: path.join(__dirname, '..', 'icon64.ico'),
        webPreferences: {
            preload: path.join(__dirname, '..', 'preload.js')
        }
    });
    mainPage.setAspectRatio(1.4);
    mainPage.loadFile(path.join(__dirname, '..', 'page', 'mainPage', 'mainPage.html'));
    mainPage.removeMenu();

    
    console.log('应用程序是否设置为开机自启:', isAutoStart);
    if (isAutoStart){
        mainPage.hide();
    }

    // const dialogOpts = {
    //     type: 'info',
    //     title: '弹窗标题',
    //     message: isAutoStart,
    //     buttons: ['确认', '取消']
    //   };
     
    //   dialog.showMessageBox(mainPage, dialogOpts).then((response) => {
    //     console.log(response.response); // 输出用户点击的按钮索引
    //   });

    mainPage.on('maximize', () => {
        mainPage.webContents.send('window-is-maximized', true);
    });

    mainPage.on('unmaximize', () => {
        mainPage.webContents.send('window-is-maximized', false);
    });

    mainPage.on('close', (event) => {
        if (!getQuitFlag()) {
            event.preventDefault();
            mainPage.hide();
            mainPage.setSkipTaskbar(true);
        }
    });

    return mainPage;
}

module.exports = { createMainWindow };