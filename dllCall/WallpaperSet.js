const { getDllPath } = require('./dllPathUtils');

let koffi;
// if (app.isPackaged) {
//     koffi = require(path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', 'koffi'));
// }else{
    koffi = require('koffi');
// }

// 构建 DLL 路径
let DLLPath = getDllPath('WallpaperSet.dll');


const WallpaperSet = koffi.load(DLLPath);

// 定义 C 数据类型
const HANDLE = koffi.pointer('HANDLE', koffi.opaque());
const HWND = koffi.alias('HWND', HANDLE);

// 创建 WorkerW 窗口的函数
const SetWindowAsWallpaper = WallpaperSet.func('void SetWindowAsWallpaper(HWND hwnd)', 'pointer');
const WallpaperCloseDLL = WallpaperSet.func('void WallpaperClose()');



module.exports = {
    SetWindowAsWallpaper,
    WallpaperCloseDLL
};
