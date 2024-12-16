const { app, globalShortcut } = require("electron");
const Screenshots = require("electron-screenshots");
const { createImgWindows, mainPage } = require('./windowManager');
const { showMessageBox } = require('../utils/dialogUtils');

let screenshots;

function startScreenShots(){
    screenshots = new Screenshots();

    // globalShortcut.register("esc", () => {
    //     if (screenshots.$win?.isFocused()) {
    //         screenshots.endCapture();
    //     }
    // });
    // 点击确定按钮回调事件
    screenshots.on("ok", (e, buffer, bounds) => {
        // console.log("capture", buffer, bounds);
        createImgWindows(buffer, bounds);
        showMessageBox(mainPage, "info", ['确定'], 0, 0, '截图成功', '图片已复制到剪贴板');
    });

    // screenshots.on("cancel", (e) => {
    //     // 执行了preventDefault
    //     // 点击取消不会关闭截图窗口
    //     e.preventDefault();
    //     // console.log("capture", "cancel2");
    // });
    // 点击保存按钮回调事件
    screenshots.on("save", (e, buffer, bounds) => {
        // console.log("capture", buffer, bounds);
    });
    // 保存后的回调事件
    screenshots.on("afterSave", (e, buffer, bounds, isSaved) => {
        // console.log("capture", buffer, bounds);
        // console.log("isSaved", isSaved) // 是否保存成功
    });
}

function setScreenShotsGlobalShortcut(){
    screenshots.startCapture();
    // screenshots.$view.webContents.openDevTools();
}


module.exports = {
    startScreenShots,
    setScreenShotsGlobalShortcut
}