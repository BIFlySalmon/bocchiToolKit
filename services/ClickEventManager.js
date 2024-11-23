function addWindowClickEvent(win) {
    // 动态注入渲染进程脚本
    // console.log('executeJavaScript');
    win.webContents.executeJavaScript(`
        document.addEventListener('click', (event) => {
            console.log('click');
            window.electronAPI.sendClickEvent();
        });
        window.addEventListener('mouseEnter', () => {
            console.log('Mouse entered the window');
            window.electronAPI.sendMoseEvent('mouseEnter');
        });

        window.addEventListener('mouseLeave', () => {
            console.log('Mouse left the window');
            window.electronAPI.sendMoseEvent('mouseLeave');
        });
    `);

}



module.exports = {
    addWindowClickEvent,
}