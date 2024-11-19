const { contextBridge , ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
    quitApp: () => ipcRenderer.send('app-quit'),  // 向主进程发送退出请求
    winMinimize: () => ipcRenderer.send('window-minimize'),
    winMaximize: () => ipcRenderer.send('window-maximize'),
    winClose: () => ipcRenderer.send('window-close'),
    restoreDesktop: () => ipcRenderer.send('restoreDesktop'),
    createDesktop: () => ipcRenderer.send('createDesktop')
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
  settingsGetAll: () => ipcRenderer.sendSync('settings:getAll')
});