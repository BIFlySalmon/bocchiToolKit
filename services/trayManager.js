const { Tray, Menu } = require('electron');
const path = require('node:path');

function setupTray(mainPage, quitApp) {
    const tray = new Tray(path.join(__dirname, '..','icon64.ico'));
    tray.setToolTip('波奇工具箱');

    const contextMenu = Menu.buildFromTemplate([
        {
            label: '显示',
            click: () => { mainPage.show(); }
        },
        {
            label: '退出',
            click: () => { quitApp(); }
        }
    ]);
    
    tray.setContextMenu(contextMenu);

    tray.on('double-click', () => {
        mainPage.isVisible() ? mainPage.hide() : mainPage.show();
        mainPage.setSkipTaskbar(!mainPage.isVisible());
    });

    return tray;
}

module.exports = { setupTray };
