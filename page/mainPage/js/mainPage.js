const radioButtons = document.querySelectorAll('input[name="option"]');
const fileInput = document.getElementById('file-input');
const urlInput = document.getElementById('url-input');
const bilibiliInput = document.getElementById('bilibili-input');
const bilibiliHint = document.getElementById('bilibili-hint');


let firstKeyBoard;

document.addEventListener('DOMContentLoaded', () => {
    // 获取初始值
    const wallpaperType = window.settingsAPI.settingsGet('wallpaperType');
    const wallpaperPath = window.settingsAPI.settingsGet('wallpaperPath');

    // 定位元素
    const fileInput = document.getElementById('file-input');
    const urlInput = document.getElementById('url-input');
    const bilibiliInput = document.getElementById('bilibili-input');
    const bilibiliHint = document.getElementById('bilibili-hint');
    const muteButton = document.getElementById('muteButton');
    
    // 设置初始状态
    autoLaunch();
    loadWallpaperSwitch(true);
    loadAutoLaunthBatSwitch();
    loadAppInfo();
    keyboardSettings();
    autoGetPictureSettings();
    loadshortcut();
    visualAudioSettings();
    
    if (wallpaperType === 'img' || wallpaperType === 'video') {
        fileInput.style.display = 'flex';
        urlInput.style.display = 'none';
        bilibiliInput.style.display = 'none';
        bilibiliHint.style.display = 'none';
        document.getElementById('file-path').value = wallpaperPath || '';
        document.querySelector(`input[value="${wallpaperType}"]`).checked = true;
        muteButton.style.display= wallpaperType === 'img'?"none":"inline-block"; 
    } else if (wallpaperType === 'url') {
        fileInput.style.display = 'none';
        urlInput.style.display = 'flex';
        bilibiliInput.style.display = 'none';
        bilibiliHint.style.display = 'none';
        document.getElementById('url-path').value = wallpaperPath || '';
        document.querySelector(`input[value="url"]`).checked = true;
    } else if (wallpaperType === 'bilibili') {
        fileInput.style.display = 'none';
        urlInput.style.display = 'none';
        bilibiliInput.style.display = 'flex';
        bilibiliHint.style.display = 'block';
        document.getElementById('bilibili-id').value = wallpaperPath || '';
        document.querySelector(`input[value="bilibili"]`).checked = true;
    }

    // 监听切换事件
    const radioButtons = document.querySelectorAll('input[name="option"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            document.getElementById('file-path').value = '';
            document.getElementById('url-path').value='';
            document.getElementById('bilibili-id').value='';
            switch (radio.value) {
                case 'img':
                    fileInput.style.display = 'flex';
                    urlInput.style.display = 'none';
                    bilibiliInput.style.display = 'none';
                    bilibiliHint.style.display = 'none';
                    muteButton.style.display= 'none';
                    break;
                case 'video':
                    fileInput.style.display = 'flex';
                    urlInput.style.display = 'none';
                    bilibiliInput.style.display = 'none';
                    bilibiliHint.style.display = 'none';
                    muteButton.style.display= 'inline-block';
                    break;
                case 'url':
                    fileInput.style.display = 'none';
                    urlInput.style.display = 'flex';
                    bilibiliInput.style.display = 'none';
                    bilibiliHint.style.display = 'none';
                    muteButton.style.display= 'inline-block';
                    break;
                case 'bilibili':
                    fileInput.style.display = 'none';
                    urlInput.style.display = 'none';
                    bilibiliInput.style.display = 'flex';
                    bilibiliHint.style.display = 'block';
                    muteButton.style.display= 'inline-block';
                    break;
            }
        });
    });
});


document.getElementById('selectFile').addEventListener('click', async () => {
    // 获取选中的类型
    const selectedType = document.querySelector('input[name="option"]:checked').value;

    const filePath = await window.fileAPI.openFile(selectedType);
    if (filePath) {
        // 将路径显示到输入框中
        document.getElementById('file-path').value = filePath;

        // 保存路径到 wallpaperPath
        // window.settingsAPI.settingsSet('wallpaperPath', filePath);
    } else {
        // alert('文件选择已取消');
    }
});

/**
 * 保存设置
 */
document.getElementById('settingsSend').addEventListener('click', () => {
    // 获取选中的类型
    const selectedType = document.querySelector('input[name="option"]:checked').value;
    
    // 根据选中的类型获取对应的路径值
    let pathValue = '';
    if (selectedType === 'img' || selectedType === 'video') {
        pathValue = document.getElementById('file-path').value.trim();
    } else if (selectedType === 'url') {
        pathValue = document.getElementById('url-path').value.trim();
    } else if (selectedType === 'bilibili') {
        pathValue = document.getElementById('bilibili-id').value.trim();
    }

    // 保存设置值
    if (selectedType && pathValue) {
        
        window.settingsAPI.settingsSet('wallpaperType', selectedType);
        window.settingsAPI.settingsSet('wallpaperPath', pathValue);

        // 提示用户保存成功
        // alert('设置已保存！');
        window.electronAPI.showMessageBox('mainPage', 'info', ['确定'], 0, 0, '提示', '已保存');
        loadWallpaperSwitch(false);
    } else {
        // 提示用户输入完整信息
        alert('请填写完整的路径信息！');
    }
});

document.getElementById('wallpaperOff').addEventListener('click', () => {
    window.settingsAPI.settingsSet('wallpaperSwitch', false);
    loadWallpaperSwitch(false);
});

document.getElementById('wallpaperOn').addEventListener('click', () => {
    window.settingsAPI.settingsSet('wallpaperSwitch', true);
    loadWallpaperSwitch(false);
});

//是否静音
document.getElementById('muteButton').addEventListener('click', () => {
    let mute = window.settingsAPI.settingsGet('mute');
    mute = !mute;
    window.settingsAPI.settingsSet('mute', mute);
    document.getElementById('muteButton').style.backgroundColor = mute ? 'lightgray': 'rgb(255, 186, 201)';
    window.electronAPI.refreshMute();
});


//更新窗口壁纸设置
function loadWallpaperSwitch(isStartLoad){
    const wallpaperSwitch = window.settingsAPI.settingsGet('wallpaperSwitch');
    const mute = window.settingsAPI.settingsGet('mute');
    const pauseSwitch = window.settingsAPI.settingsGet('pauseSwitch');
    const posterGirlOnOff = window.settingsAPI.settingsGet('posterGirlOnOff');
    document.getElementById('wallpaperOn').disabled = wallpaperSwitch;
    document.getElementById('wallpaperOff').disabled = !wallpaperSwitch;
    document.getElementById('muteButton').style.backgroundColor = mute ? 'lightgray': 'rgb(255, 186, 201)';
    document.getElementById('pauseButton').checked  = pauseSwitch;
    document.getElementById('posterGirlOnOff').checked  = posterGirlOnOff;
    if(!isStartLoad){
        window.electronAPI.wallpaperRefresh();
    }
}

//更新窗口自启动脚本设置
function loadAutoLaunthBatSwitch(){
    const autoLaunthBat = window.settingsAPI.settingsGet('autoLaunthBat');
    document.getElementById('batInput').value = autoLaunthBat;
}

async function autoLaunch(){
    const isEnabled = await window.autoLaunchAPI.isAutoLaunchEnabled();
    document.getElementById('autoLaunchToggle').checked = isEnabled;
}

async function keyboardSettings(){
    const isEnabled = await window.keyboardManager.getKeyboards();
    firstKeyBoard = isEnabled;
    document.getElementById('manage-keyboard-btn').innerText = isEnabled === "disabled"?"启用键盘":"禁用键盘";
}

async function autoGetPictureSettings(){
    const isEnabled = await window.autoGetPictureAPI.getAutoGetPicture();
    document.getElementById('autoGetPicture').innerText = isEnabled === false?"点击启用":"点击禁用";
}

async function visualAudioSettings(){
    const isEnabled = await window.settingsAPI.settingsGet('visualAudio');
    document.getElementById('visualAudioBtn').innerText = isEnabled === false?"点击启用":"点击禁用";
}

// 监听自启动开关的变化
document.getElementById('autoLaunchToggle').addEventListener('change', async (event) => {
    const enable = event.target.checked;
    await window.autoLaunchAPI.setAutoLaunch(enable);
});

//保存自启动脚本
document.getElementById('saveAutoLaunchBat').addEventListener('click', () => {
    window.settingsAPI.settingsSet('autoLaunthBat', document.getElementById('batInput').value);
    // alert('已保存');
    window.electronAPI.showMessageBox('mainPage', 'info', ['确定'], 0, 0, '提示', '已保存');
});

document.getElementById('runAutoLaunchBat').addEventListener('click', () => {
    window.electronAPI.executeBat();
});

document.getElementById('pauseButton').addEventListener('click', () => {
    window.settingsAPI.settingsSet('pauseSwitch', document.getElementById('pauseButton').checked );
});


function loadAppInfo(){
    document.getElementById('appVersionShow').innerText = 'V' + window.electronAPI.getAppVersion();
    document.getElementById('appAuthorShow').innerText = 'by:' + window.electronAPI.getAppAuthor();
}

function loadshortcut(){
    document.getElementById('showWindow').value = window.settingsAPI.settingsGet('shortcuts.show-window');
    document.getElementById('screenShotsKey').value = window.settingsAPI.settingsGet('shortcuts.printscreen');
}

document.getElementById('shortCatKeySettings').addEventListener('click', () => {
    window.settingsAPI.updateShortcut('show-window', document.getElementById('showWindow').value);
    window.settingsAPI.updateShortcut('printscreen', document.getElementById('screenShotsKey').value);
    loadshortcut();
    window.electronAPI.showMessageBox('mainPage', 'info', ['确定'], 0, 0, '提示', '已保存');
});

document.getElementById('posterGirlOnOff').addEventListener('click', () => {
    const posterGirlOnOff = document.getElementById('posterGirlOnOff').checked 
    window.settingsAPI.settingsSet('posterGirlOnOff', posterGirlOnOff);
    window.electronAPI.refreshWindows();

});

document.getElementById('nextLive2D').addEventListener('click', () => {
    window.live2d.nextLive2D();
});

document.getElementById('appVersionShow').addEventListener('click', () => {
    window.electronAPI.openVersion();
});


document.getElementById('manage-keyboard-btn').addEventListener('click', async () => {
    document.getElementById('manage-keyboard-btn').disabled = true;
    document.getElementById('manage-keyboard-btn').innerText = "设置中...";
    const updatedState = await window.keyboardManager.toggleKeyboard();
    document.getElementById('manage-keyboard-btn').innerText = !updatedState?"禁用键盘(需重启)":"启用键盘(需重启)";
    document.getElementById('manage-keyboard-btn').disabled = false;
    await window.keyboardManager.showConfirmDialogg();
});


document.getElementById('autoGetPicture').addEventListener('click', async () => {
    document.getElementById('autoGetPicture').disabled = true;
    document.getElementById('autoGetPicture').innerText = "设置中...";
    const updatedState = await window.autoGetPictureAPI.setAutoGetPicture();
    document.getElementById('autoGetPicture').innerText = !updatedState?"点击启用":"点击禁用";
    document.getElementById('autoGetPicture').disabled = false;
});

document.getElementById('openPicDir').addEventListener('click', () => {
    window.autoGetPictureAPI.openPicDir();
});


document.getElementById('visualAudioBtn').addEventListener('click', async () => {
    document.getElementById('visualAudioBtn').disabled = true;
    document.getElementById('visualAudioBtn').innerText = "设置中...";
    const updatedState = await window.visualAudioAPI.setVisualAudio();


    // let isEnabled = await window.settingsAPI.settingsGet('visualAudio');
    // await window.settingsAPI.settingsSet('visualAudio', !isEnabled);
    // isEnabled = await window.settingsAPI.settingsGet('visualAudio');
    document.getElementById('visualAudioBtn').innerText = !updatedState?"点击启用":"点击禁用";
    document.getElementById('visualAudioBtn').disabled = false;
});


const shortcutContainer = document.getElementById('shortcutContainer');

// 按键状态记录
let keys = new Set();

// 格式化快捷键
const formatShortcut = (keys) => {
    return Array.from(keys)
        .map((key) => {
            if (key === ' ') return 'Space';
            if (['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
                return key;
            }
            return key.charAt(0).toUpperCase() + key.slice(1);
        })
        .join('+');
};

// 监听输入框的点击事件
shortcutContainer.addEventListener('focusin', (event) => {
    const target = event.target;

    // 确认事件目标是输入框
    if (target.tagName === 'INPUT' && target.classList.contains('baseInput')) {
        keys.clear(); // 清空上次的按键记录
        target.value = ''; // 清空输入框

        const keydownHandler = (event) => {
            event.preventDefault();
            keys.add(event.key);
            target.value = formatShortcut(keys);
        };

        const keyupHandler = (event) => {
            event.preventDefault();
            keys.delete(event.key);

            // 当没有按键按下时，移除事件监听
            if (keys.size === 0) {
                window.removeEventListener('keydown', keydownHandler);
                window.removeEventListener('keyup', keyupHandler);
            }
        };

        // 添加全局键盘事件监听
        window.addEventListener('keydown', keydownHandler);
        window.addEventListener('keyup', keyupHandler);
    }
});

// // 监听输入框的点击事件
// shortcutContainer.addEventListener('focusout', (event) => {
//     const target = event.target;
//     // 确认事件目标是输入框
//     if (target.tagName === 'INPUT' && target.classList.contains('baseInput')) {
//         loadshortcut();
//     }
// });