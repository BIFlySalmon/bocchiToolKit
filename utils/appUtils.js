const { WallpaperClose } = require('../dllCall/WallpaperSet');
let quitFlag = false;

function quitApp() {
    WallpaperClose();
    quitFlag = true;
    require('electron').app.quit();
}

function getQuitFlag() {
    return quitFlag;
}

module.exports = { quitApp, getQuitFlag };
