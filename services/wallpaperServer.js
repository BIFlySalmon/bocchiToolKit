const { BrowserWindow } = require('electron'); // 确保引用 electron 模块
const path = require('node:path');
const { storeManager } = require('./storeManager');
const { SetWindowAsWallpaper, WallpaperCloseDLL } = require('../dllCall/WallpaperSet');
let backgroundPage;



function wallpaperRefresh(){
  wallpaperClose();
  return storeManager.get('wallpaperSwitch')? backgroundPageCreate(): backgroundPage
}

function wallpaperClose(){
  // console.log(backgroundPage);
  if (!(backgroundPage == null || backgroundPage == undefined)){
      backgroundPage.close();
      WallpaperCloseDLL();
      backgroundPage = null;
  }
  return backgroundPage;
}

// 动态壁纸
function backgroundPageCreate(){

  backgroundPage= new BrowserWindow({
    width: 800,
    height: 600,
    title: "bocchiWallpaper",
    frame: false,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js')
    }
  });


  backgroundPage.loadFile(path.join(__dirname,'..', 'page', 'wallpaperPage', 'wallpaperPage.html'));

  // backgroundPage.setIgnoreMouseEvents(true);  // 使窗口点击穿透

  // 获取 Electron 窗口句柄
  const hwndElectron = backgroundPage.getNativeWindowHandle();
  SetWindowAsWallpaper(hwndElectron);

  return backgroundPage;
}

module.exports = {
  wallpaperRefresh,
  wallpaperClose,
  backgroundPageCreate
}