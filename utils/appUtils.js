const { WallpaperCloseDLL } = require('../dllCall/WallpaperSet');
let quitFlag = false;

function quitApp() {
    WallpaperCloseDLL();
    quitFlag = true;
    require('electron').app.quit();
}

function getQuitFlag() {
    return quitFlag;
}

module.exports = { quitApp, getQuitFlag };
