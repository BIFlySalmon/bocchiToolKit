const { app } = require('electron');

// 设置开机自启动
function setAutoLaunch(enable) {
  app.setLoginItemSettings({
    openAtLogin: enable, // 是否开机自启动
    path: '"' + app.getPath('exe') + '"', // 应用程序的路径
    args: ['-autoLaunch'], // 通过 args 指定启动时的额外参数
  });
}

// 检查当前开机自启状态
function isAutoLaunchEnabled() {
  const settings = app.getLoginItemSettings({
    path: '"' + app.getPath('exe') + '"', // 应用程序的路径
    args: ['-autoLaunch'], // 通过 args 指定启动时的额外参数
  });
  return settings.openAtLogin;
}

// 导出功能供渲染进程调用
module.exports = { setAutoLaunch, isAutoLaunchEnabled };
