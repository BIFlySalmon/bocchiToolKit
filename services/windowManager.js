const { BrowserWindow } = require('electron');
const path = require('node:path');
const { getQuitFlag } = require('../utils/appUtils');

function createMainWindow() {
    const mainPage = new BrowserWindow({
        width: 1000,
        height: 600,
        minWidth: 300,
        minHeight: 200,
        frame: false,
        icon: path.join(__dirname, '..', 'icon64.ico'),
        webPreferences: {
            preload: path.join(__dirname, '..', 'preload.js')
        }
    });

    mainPage.loadFile(path.join(__dirname, '..', 'page', 'mainPage', 'mainPage.html'));
    mainPage.removeMenu();

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