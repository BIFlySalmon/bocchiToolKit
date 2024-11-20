const { app } = require('electron');

// 设置开机自启动
function setAutoLaunch(enable) {
  app.setLoginItemSettings({
    openAtLogin: enable, // 是否开机自启动
    path: app.getPath('exe'), // 应用程序的路径
  });
}

// 检查当前开机自启状态
function isAutoLaunchEnabled() {
  const settings = app.getLoginItemSettings();
  return settings.openAtLogin;
}

// 导出功能供渲染进程调用
module.exports = { setAutoLaunch, isAutoLaunchEnabled };
