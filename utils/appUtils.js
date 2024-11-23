const { WallpaperCloseDLL } = require('../dllCall/WallpaperSet');
const { globalShortcut } = require('electron');
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

module.exports = { quitApp, getQuitFlag };
