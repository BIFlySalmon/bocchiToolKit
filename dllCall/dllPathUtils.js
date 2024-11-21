const { app } = require('electron');
const path = require('node:path');

function getDllPath(dllName){
    // 构建 DLL 路径
    let DLLPath;
    if (app.isPackaged) {
        DLLPath = path.join(process.resourcesPath, 'dll', dllName);
    }else{
        DLLPath = path.join(process.cwd(), 'resources', 'dll', dllName);
    }
    return DLLPath;
}

module.exports = {
    getDllPath
}