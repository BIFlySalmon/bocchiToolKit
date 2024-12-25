const { contextBridge , ipcRenderer } = require('electron/renderer');



contextBridge.exposeInMainWorld('electronAPI', {
    quitApp: () => ipcRenderer.send('app-quit'),  // 向主进程发送退出请求
    winMinimize: () => ipcRenderer.send('window-minimize'),
    winMaximize: () => ipcRenderer.send('window-maximize'),
    winClose: () => ipcRenderer.send('window-close'),
    // restoreDesktop: () => ipcRenderer.send('restoreDesktop'),
    // createDesktop: () => ipcRenderer.send('createDesktop'),
    wallpaperRefresh: () => ipcRenderer.send('wallpaperRefresh'),
    refreshMute: () => ipcRenderer.send('refreshMute'),
    // onMessage: (callback) => ipcRenderer.on('refreshMute', callback),
    executeBat: () => ipcRenderer.send('execute-bat'),  //测试运行启动脚本
    onfindMaxWinMsg: (callback) => ipcRenderer.on('findMaxWinMsg', callback),
    getImgPath: (callback) => ipcRenderer.on('getImgPath', callback),
    hello: (callback) => ipcRenderer.on('hello', callback),
    getAppVersion: (appVersion) => ipcRenderer.sendSync('getAppVersion', appVersion),
    getAppAuthor: (appAuthor) => ipcRenderer.sendSync('getAppAuthor', appAuthor),
    refreshWindows: () => ipcRenderer.send('refreshWindows'),
    sendClickEvent: () => ipcRenderer.send('click-event'),
    sendMoseEvent: (moseEvent) => ipcRenderer.send('sendMoseEvent', moseEvent),
    showContextMenu: (position) => ipcRenderer.send('showContextMenu', position),
    openVersion: () => ipcRenderer.send('openVersion'),
    showMessageBox: (win, type, buttons, defaultId, cancelId, title, message) => 
      ipcRenderer.send('showMessageBox', win, type, buttons, defaultId, cancelId, title, message),
    getOrigin:(client, rect) => ipcRenderer.sendSync('getOrigin', client, rect ),
    mul: (num1, num2) => ipcRenderer.sendSync('mul', num1, num2),
    div: (num1, num2) => ipcRenderer.sendSync('div', num1, num2)
});


// 暴露安全接口给渲染进程
contextBridge.exposeInMainWorld('keyboardManager', {
  getKeyboards: () => ipcRenderer.invoke('get-keyboards'),
  toggleKeyboard: () => ipcRenderer.invoke('toggle-keyboard'),
  showConfirmDialogg: () => ipcRenderer.sendSync('show-confirm-dialog')
});

contextBridge.exposeInMainWorld('live2d', {
  getlive2dPath: () => ipcRenderer.sendSync('getlive2dPath'),
  nextLive2D: () => ipcRenderer.send('nextLive2D'),
  onNextLive2D: (callback) => ipcRenderer.on('onNextLive2D', callback)
});

contextBridge.exposeInMainWorld('autoLaunchAPI', {
  setAutoLaunch: (enable) => ipcRenderer.invoke('set-auto-launch', enable),
  isAutoLaunchEnabled: () => ipcRenderer.invoke('get-auto-launch-status'),
});

contextBridge.exposeInMainWorld('autoGetPictureAPI', {
  getAutoGetPicture: () => ipcRenderer.invoke('getAutoGetPicture'),
  setAutoGetPicture: () => ipcRenderer.invoke('setAutoGetPicture'),
  openPicDir: () => ipcRenderer.send('openPicDir')
});


contextBridge.exposeInMainWorld('visualAudioAPI', {
  setVisualAudio: () => ipcRenderer.invoke('setVisualAudio')
});


contextBridge.exposeInMainWorld('fileAPI', {
  openFile: async (selectedType) => await ipcRenderer.invoke('dialog:openFile', selectedType),
});

contextBridge.exposeInMainWorld('settingsAPI', {

  // 获取某个设置项的值
  settingsGet: (key) => ipcRenderer.sendSync('settings:get', key),

  // 设置某个设置项的值
  settingsSet: (key, value) => ipcRenderer.send('settings:set', key, value),

  // 重置某个设置项到默认值
  settingsReset: (key) => ipcRenderer.send('settings:reset', key),

  // 重置所有设置项到默认值
  settingsResetAll: () => ipcRenderer.send('settings:resetAll'),

  // 检查某个设置项是否存在
  settingsHas: (key) => ipcRenderer.sendSync('settings:has', key),

  // 获取所有设置项
  settingsGetAll: () => ipcRenderer.sendSync('settings:getAll'),

  //设置快捷键
  updateShortcut: (action, newShortcut) => ipcRenderer.send('updateShortcut', action, newShortcut)
});

contextBridge.exposeInMainWorld('api', {
  sendShortcut: (shortcut) => ipcRenderer.send('shortcut', shortcut),
});

// contextBridge.exposeInMainWorld('updateAPI', {
//   updateAvailable : () => ipcRenderer.on('update-available'),
//   updateDownloaded : () => ipcRenderer.on('update-downloaded')
// });