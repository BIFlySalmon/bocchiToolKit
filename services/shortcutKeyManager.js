const { globalShortcut } = require('electron');
const { storeManager } = require('./storeManager');
const { mainPageHide, mainPageShow, getMianPageVisible } = require('./windowManager');
const { setScreenShotsGlobalShortcut } = require('./printScreen');


// function test(){
//     // 注册全局快捷键
//     globalShortcut.register('CommandOrControl+Shift+X', () => {
//         // console.log('快捷键被触发！');
//         if (mainWindow) {
//             mainWindow.show(); // 或执行其他操作
//         }
//     });
// }



function registerShortcuts() {
    const shortcuts = storeManager.get('shortcuts');

    for (const [action, shortcut] of Object.entries(shortcuts)) {
        const success = globalShortcut.register(shortcut, () => {
            handleShortcutAction(action);
        });

        if (!success) {
            // console.warn(`无法注册快捷键: ${shortcut}`);
        }
    }
}

function handleShortcutAction(action) {
    switch (action) {
        case 'show-window':
            if (getMianPageVisible()) {
                mainPageHide();
            }else{
                mainPageShow();
            }
            break;
        case 'printscreen':
            // console.log('PrintSreeen');
            setScreenShotsGlobalShortcut();
            break;
        default:
            // console.warn(`unknow: ${action}`);
    }
}


function updateShortcut(action, newShortcut) {
    const shortcuts = storeManager.get('shortcuts');
    // console.log(shortcuts);
    // 检查是否存在该动作的快捷键
    if (shortcuts[action]) {
        shortcuts[action] = newShortcut; // 更新指定的快捷键
        storeManager.set(`shortcuts.${action}`, newShortcut); // 仅更新该键值对
        // console.log(`key ${action} updated: ${newShortcut}`);

        // 重新注册单个快捷键
        globalShortcut.unregister(newShortcut); // 先注销旧的快捷键
        const success = globalShortcut.register(newShortcut, () => {
            // // console.log(`key: ${newShortcut} (Action: ${action})`);
            handleShortcutAction(action);
        });

        if (success) {
            // console.log(`key ${action} success: ${newShortcut}`);
        } else {
            // console.warn(`key ${action} error: ${newShortcut}`);
        }
    } else {
        // console.warn(`action: ${action} notfind`);
    }
}

module.exports = {
    registerShortcuts,
    updateShortcut
}