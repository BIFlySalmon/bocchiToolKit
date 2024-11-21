const { BrowserWindow, dialog } = require('electron');
const path = require('node:path');
const { getQuitFlag } = require('../utils/appUtils');
const { executeBat } = require('./batManager');
const isAutoStart = process.argv.includes('-autoLaunch');

function createMainWindow() {
    const mainPage = new BrowserWindow({
        width: 1000,
        height: 600,
        minWidth: 472,
        minHeight: 350,
        frame: false,
        show: false,
        icon: path.join(__dirname, '..', 'icon64.ico'),
        webPreferences: {
            preload: path.join(__dirname, '..', 'preload.js')
        }
    });
    mainPage.setAspectRatio(1.4);
    mainPage.loadFile(path.join(__dirname, '..', 'page', 'mainPage', 'mainPage.html'));
    mainPage.removeMenu();



    mainPage.on('ready-to-show', () => {
        //判断是否为开机自启
        if (isAutoStart){
            executeBat();
        }else{
            mainPage.show() // 初始化后再显示，防止启动白屏
        }
    })

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