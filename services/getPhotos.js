const { executeFFmpegCommandSync } = require('../utils/ffmpegUtils');
const { app, shell } = require('electron');
const path = require('node:path');
const { storeManager } = require('./storeManager');

// 获取默认摄像头设备
function getDefaultCameraDevice() {
    let deviceName;
    try {
        const args = ['-list_devices', 'true', '-f', 'dshow', '-i', 'dummy']; // Windows 使用 dshow，Linux 用 v4l2
        const data = executeFFmpegCommandSync(args); // 使用同步方式执行 FFmpeg 命令

        // 在 Windows 中，设备名称通常出现在 stderr 输出中
        const deviceMatches = data.errorOutput.match(/\[dshow @ [^\]]+\] "([^"]+)" \(video\)/g);

        if (deviceMatches && deviceMatches.length > 0) {
            // 返回第一个匹配到的设备名称（默认为第一个摄像头）
            deviceName = deviceMatches[0].match(/"([^"]+)"/)[1];
        } else {
            throw new Error('No camera device found.');
        }
    } catch (error) {
        console.error('Error fetching default camera device:', error.message);
    }
    
    return deviceName;
}

// 获取当前日期时间并格式化为 yyyy_mm_dd_hh_mm_ss
function getFormattedDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}_${hour}：${minute}：${second}.png`;
}

// 拍摄并保存图片
function captureSnapshot() {
    if (!storeManager.get('autoGetPicture')){
        return
    }
    try {
        const deviceName = getDefaultCameraDevice();
        if (!deviceName) {
            throw new Error('No valid camera device available.');
        }
        console.log(`Using camera: ${deviceName}`);

        // 获取当前日期时间并格式化为文件名
        const fileName = getFormattedDateTime();

        let filePath;
        if (app.isPackaged) {
            filePath = path.join(process.resourcesPath, 'picture', fileName);
        }else{
            filePath = path.join(process.cwd(), 'resources', 'picture', fileName);
        }

        // 替换所有反斜杠为正斜杠
        filePath = filePath.replace(/\\/g, '/');
        
        // 使用 FFmpeg 捕获一张图片并保存到项目根目录
        const args = [
            '-f', 'dshow',  // 使用 dshow 格式（Windows）
            '-i', `video=${deviceName}`, // 默认摄像头
            '-vframes', '1',  // 捕获一帧图像
            '-f', 'image2', 
            `${filePath}`    // 动态生成的文件名
        ];
        
        const res = executeFFmpegCommandSync(args);
        // console.log(res);
        console.log(`Snapshot saved as ${fileName}`);
    } catch (error) {
        console.error('Error capturing snapshot:', error.message);
    }
}

function openPicDir(){
    let filePath;
    if (app.isPackaged) {
        filePath = path.join(process.resourcesPath, 'picture');
    }else{
        filePath = path.join(process.cwd(), 'resources', 'picture');
    }
    shell.openPath(filePath);
}

function getAutoGetPicture(){
    return storeManager.get('autoGetPicture')
}


function setAutoGetPicture(){
    storeManager.set('autoGetPicture', !getAutoGetPicture());
    return getAutoGetPicture();
}


module.exports = {
    captureSnapshot,
    getAutoGetPicture,
    setAutoGetPicture,
    openPicDir
};
