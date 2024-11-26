const { app, BrowserWindow, dialog, screen , Menu, Notification } = require('electron');
const path = require('node:path');
const fs = require('fs');
const { getQuitFlag } = require('../utils/appUtils');
const { executeBat } = require('./batManager');
const isAutoStart = process.argv.includes('-autoLaunch');
const mouseThroughManager = require('./mouseThroughManager');
const { addWindowClickEvent } = require('./ClickEventManager');
const { storeManager } = require('./storeManager');

let mainPage;
let imgWindows;
let posterGirlWindows;

function createMainWindow() {
    mainPage = new BrowserWindow({
        width: 1000,
        height: 600,
        minWidth: 472,
        minHeight: 350,
        frame: false,
        show: false,
        icon: path.join(__dirname, '..', 'icon64.ico'),
        webPreferences: {
            preload: path.join(__dirname, '..', 'preload.js')
        }
    });
    mainPage.setAspectRatio(1.4);
    mainPage.loadFile(path.join(__dirname, '..', 'page', 'mainPage', 'mainPage.html'));
    mainPage.removeMenu();

    addWindowClickEvent(mainPage);

    mainPage.on('ready-to-show', () => {
        //判断是否为开机自启
        if (isAutoStart){
            executeBat();
        }else{
            mainPage.show() // 初始化后再显示，防止启动白屏
        }
    });

    mainPage.on('maximize', () => {
        mainPage.webContents.send('window-is-maximized', true);
    });

    mainPage.on('unmaximize', () => {
        mainPage.webContents.send('window-is-maximized', false);
    });

    mainPage.on('close', (event) => {
        if (!getQuitFlag()) {
            event.preventDefault();
            mainPage.hide();
            mainPage.setSkipTaskbar(true);


            // 检查通知是否可用
            if (!storeManager.get('onceNotification') && Notification.isSupported()) {
                const notification = new Notification({
                    title: '已最小化到托盘',
                    body: '为保证壁纸等功能正常运作，需要保持后台运行哦~',
                    icon: path.join(__dirname, '..', 'icon256.ico'),
                });
                notification.show();
                storeManager.set('onceNotification', true);
            }
        }
    });

    return mainPage;
}

function mainPageShow(){
    mainPage.show();
}

function mainPageHide(){
    mainPage.hide();
}

function getMianPageVisible(){
    return mainPage.isVisible();
}


function ensureFolderExists(folderPath) {
    // dialog.showErrorBox('路径错误', folderPath);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true }); // 创建文件夹，包括所有父级文件夹
        // console.log(`文件夹已创建：${folderPath}`);
    }
}

function deleteFolderAndContents() {
    let folderPath;
    if (app.isPackaged) {
        folderPath = path.join(process.resourcesPath, 'temp_img');
    }else{
        folderPath = path.join(process.cwd(), 'resources', 'temp_img');
    }
    try {
        fs.rmSync(folderPath, { recursive: true, force: true });
        // console.log(`文件夹及其内容已删除：${folderPath}`);
    } catch (err) {
        console.error(`删除文件夹时出错：${err.message}`);
    }
}

function createImgWindows(buffer, bounds){
    const timestamp = Date.now();

    let tempFilePath;
    if (app.isPackaged) {
        tempFilePath = path.join(process.resourcesPath, 'temp_img');
    }else{
        tempFilePath = path.join(process.cwd(), 'resources', 'temp_img');
    }

    ensureFolderExists(tempFilePath);
    tempFilePath = path.join(tempFilePath, `temp_image_${timestamp}.png`)
    fs.writeFileSync(tempFilePath, buffer); // 保存新文件

    // // console.log('bounds:', bounds);
    imgWindows = new BrowserWindow({
        width: bounds.bounds.width,
        height: bounds.bounds.height +20,
        // frame: false, // 无边框
        icon: path.join(__dirname, '..', 'icon64.ico'),
        webPreferences: {
            preload: path.join(__dirname, '..', 'preload.js')
        }
    });
    
    imgWindows.removeMenu();
    imgWindows.setAspectRatio(bounds.bounds.width/(bounds.bounds.height + 20) );
    imgWindows.loadFile(path.join(__dirname, '..', 'page', 'imgPage', 'imgPage.html'));
    
    addWindowClickEvent(imgWindows);

    imgWindows.webContents.once('did-finish-load', () => {
        imgWindows.webContents.send('getImgPath', tempFilePath);
    });
    
}


 // 监听显示右键菜单的请求
function showcontextmenu (position) {
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '保存图片',
            click: async () => {
                
                const result = await dialog.showOpenDialog(imgWindows, {
                    title: '选择保存路径',
                    properties: ['openDirectory']
                });
                // console.log(position.path);console.log(result.canceled?'NoPath':result.filePaths[0]); 
                // 使用 fs.copyFile 进行文件复制
                fs.copyFile( decodeURIComponent(position.path), decodeURIComponent(path.join(result.filePaths[0], '屏幕截图' + position.path.slice(position.path.lastIndexOf('_'))) ), (err) => {
                    if (err) {
                        dialog.showErrorBox('文件复制失败:', err.message);
                    }
                });
            }
        },
        {
            type: 'separator'
        },
        {
            label: '关闭',
            click:  () => {
                imgWindows.close();
            }
        }
    ]);

    // 在指定位置显示右键菜单
    contextMenu.popup({
        window: imgWindows,
        x: position.x,
        y: position.y
    });
}

function createposterGirlWindows(){
    posterGirlWindows = new BrowserWindow({
        width: 320,
        height: 350,
        transparent: true, // 使窗口背景透明
        frame: false,      // 去掉窗口边框
        alwaysOnTop: true, // 可选：保持窗口置顶
        skipTaskbar: true, // 不显示在任务栏
        // fullscreen:true,
        icon: path.join(__dirname, '..', 'icon64.ico'),
        webPreferences: {
            preload: path.join(__dirname, '..', 'preload.js')
        }
    });
    
    posterGirlWindows.removeMenu();
    posterGirlWindows.maximize();
    posterGirlWindows.setAlwaysOnTop(true, 'screen-saver'); // 设置为屏幕保护层级
    // 获取屏幕工作区尺寸
    // const { workArea } = screen.getPrimaryDisplay();

    // 计算右下角位置
    // const x = workArea.x + workArea.width - posterGirlWindows.getBounds().width; // 右侧位置
    // const y = workArea.y + workArea.height - posterGirlWindows.getBounds().height; // 紧贴任务栏上方

    // 设置窗口位置
    // posterGirlWindows.setBounds({ x, y, width: 320, height: 350 }); // 设置窗口大小和位置

    posterGirlWindows.loadFile(path.join(__dirname, '..', 'page', 'posterGirlPage', 'posterGirlPage.html'));
    posterGirlWindows.setIgnoreMouseEvents(true, { forward: true });


     // 监听窗口失焦后，重新设置为置顶
    posterGirlWindows.on('blur', () => {
        posterGirlWindows.setAlwaysOnTop(true, 'screen-saver'); // 设置为屏幕保护层级
    });



    mouseThroughManager.addWindow(posterGirlWindows);

    posterGirlWindows.on('close',()=>{
        mouseThroughManager.removeWindow(posterGirlWindows);
    });

    return posterGirlWindows;
}


module.exports = { 
    createMainWindow,
    mainPageHide,
    mainPageShow,
    getMianPageVisible,
    createImgWindows,
    createposterGirlWindows,
    deleteFolderAndContents,
    mouseThroughManager,
    showcontextmenu,
    mainPage
};