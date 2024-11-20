
const koffi = require('koffi');
const path = require('node:path');
// 构建 DLL 路径
const DLLPath = path.join(process.cwd(), 'resources', 'dll', 'WallpaperSet.dll');


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
