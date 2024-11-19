const { contextBridge , ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
    quitApp: () => ipcRenderer.send('app-quit'),  // 向主进程发送退出请求
    winMinimize: () => ipcRenderer.send('window-minimize'),
    winMaximize: () => ipcRenderer.send('window-maximize'),
    winClose: () => ipcRenderer.send('window-close'),
    restoreDesktop: () => ipcRenderer.send('restoreDesktop'),
    createDesktop: () => ipcRenderer.send('createDesktop')
});


contextBridge.exposeInIsolatedWorld('electronStoreAPI',{
    // 获取某个设置项的值
  get: (key) => ipcRenderer.invoke('settings:get', key),

  // 设置某个设置项的值
  set: (key, value) => ipcRenderer.invoke('settings:set', key, value),

  // 重置某个设置项到默认值
  reset: (key) => ipcRenderer.invoke('settings:reset', key),

  // 重置所有设置项到默认值
  resetAll: () => ipcRenderer.invoke('settings:resetAll'),

  // 检查某个设置项是否存在
  has: (key) => ipcRenderer.invoke('settings:has', key),

  // 获取所有设置项
  getAll: () => ipcRenderer.invoke('settings:getAll')
});