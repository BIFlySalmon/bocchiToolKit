const { getDllPath } = require('./dllPathUtils');

let koffi = require('koffi');

// 构建 DLL 路径
let DLLPath = getDllPath('maxWindowFind.dll');
let HasMaximizedWindow;

try {
    const maxWindowFind = koffi.load(DLLPath);
    HasMaximizedWindow = maxWindowFind.func('int CheckFullscreenOrMaximizedWindow()');
} catch (error) {
    console.error('Failed to load DLL:', error);
    throw error;
}

module.exports = {
    HasMaximizedWindow
};
