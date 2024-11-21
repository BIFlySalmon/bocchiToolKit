const { app } = require('electron');
const { exec } = require('child_process');
 
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

function autoLaunthBat(bat){
  // 示例：执行cmd指令，这里以'ipconfig'为例
  exec(bat, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行的错误: ${error}`);
      return;
    }
    console.log(`标准输出: ${stdout}`);
    if (stderr) {
      console.error(`标准错误: ${stderr}`);
    }
  });
}


// 导出功能供渲染进程调用
module.exports = { 
  setAutoLaunch, 
  isAutoLaunchEnabled,
  autoLaunthBat
};
