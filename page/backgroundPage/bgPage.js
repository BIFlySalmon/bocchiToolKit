const { BrowserWindow } = require('electron'); // 确保引用 electron 模块
const path = require('node:path');
const { SetWindowAsWallpaper } = require('../../dllCall/WallpaperSet');

// 动态壁纸
function backgroundPageCreate(){

  const backgroundPage = new BrowserWindow({
    width: 800,
    height: 600,
    title: "bocchiWallpaper",
    frame: false,
    // transparent: true,
    fullscreen: true
  });


  // backgroundPage.loadFile(path.join(__dirname, 'wallpaperPage.html'));

// backgroundPage.setAlwaysOnTop(false, 'desktop');
// backgroundPage.setIgnoreMouseEvents(true);  // 使窗口点击穿透
backgroundPage.loadURL('https://www.bilibili.com/video/BV1m34y1M7pG');
// backgroundPage.loadURL('https://i1.hdslb.com/bfs/article/fcf6ae3c13fc0da1d4f215c969a0ffd22a5bb5f1.jpg');




// 获取 Electron 窗口句柄
const hwndElectron = backgroundPage.getNativeWindowHandle();


  // 将 Electron 窗口附加到 WorkerW 层
  // setbgWin(workerW, hwndElectron);设置桌面
  SetWindowAsWallpaper(hwndElectron);

  return backgroundPage;
}

module.exports = {
  backgroundPageCreate
}



  //  const backgroundPage = new BrowserWindow({
  //       width: 1920,  // 设置为屏幕分辨率的宽度
  //       height: 1080, // 设置为屏幕分辨率的高度
  //       frame: false, // 无边框
  //       transparent: true,
  //       fullscreen: true,
  //     });
    
  //     // 设置窗口总在桌面层后面
  //     backgroundPage.setAlwaysOnTop(false, 'desktop');
  //     backgroundPage.setIgnoreMouseEvents(true);  // 使窗口点击穿透
    
  //     // 加载动态内容页面
  //     backgroundPage.loadURL('https://www.bilibili.com/video/BV1m34y1M7pG');
