const { createposterGirlWindows } = require('./windowManager');
const { storeManager } = require('./storeManager');
const path = require('node:path');
const { app } = require('electron');

let posterGirlWindows;

function refreshWindows(){
    posterGirlWindowsClose();
    if (storeManager.get('posterGirlOnOff')||storeManager.get('visualAudio')){
        posterGirlWindows = createposterGirlWindows();
    } else {
        return posterGirlWindows;
    }
    
}

function posterGirlWindowsClose(){
    // console.log(posterGirlWindows);
    if (!(posterGirlWindows == null || posterGirlWindows == undefined)){
        try {
            posterGirlWindows.close();
        } catch (error) {
            posterGirlWindows = null;
        }
    } else {
        posterGirlWindows = null;
    }
    
    return posterGirlWindows;
}


function getlive2dPath(){
    // 定义静态资源路径
    // const live2dPath = app.isPackaged ? path.join(process.resourcesPath, 'live2d-widget-0.9.0') : path.join(__dirname, '../resources/live2d-widget-0.9.0');
    // const live2dPath = path.join(__dirname, '../resources/live2d-widget-0.9.0');
    // return live2dPath;


    let live2dPath;
    if (app.isPackaged) {
        live2dPath = path.join(process.resourcesPath, 'live2d-widget-0.9.0');
    }else{
        live2dPath = path.join(process.cwd(), 'resources', 'live2d-widget-0.9.0');
    }
    return live2dPath;
    
}


function nextLive2D(){
    posterGirlWindows.webContents.send('onNextLive2D', true);
}

module.exports = {
    refreshWindows,
    getlive2dPath,
    nextLive2D
}
