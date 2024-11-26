const { WallpaperCloseDLL } = require('../dllCall/WallpaperSet');
const { globalShortcut } = require('electron');
const { autoUpdater } = require('electron-updater');
let quitFlag = false;

function quitApp() {
    WallpaperCloseDLL();
    globalShortcut.unregisterAll();
    quitFlag = true;
    require('electron').app.quit();
}

function getQuitFlag() {
    return quitFlag;
}

function updateToRestart(){
    WallpaperCloseDLL();
    globalShortcut.unregisterAll();
    quitFlag = true;
    autoUpdater.quitAndInstall();
}

module.exports = { 
    quitApp, 
    getQuitFlag, 
    updateToRestart 
};
