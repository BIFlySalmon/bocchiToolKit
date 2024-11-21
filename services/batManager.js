const { app } = require('electron');
const { writeFileSync, unlinkSync } = require('fs');
const { join } = require('path');
const { exec } = require('child_process');
const { storeManager } = require('./storeManager');

function executeBat() {

    const batContent = storeManager.get('autoLaunthBat');
    const batPath = join(app.getPath('temp'), 'temp_script.bat');

    if (batContent.trim() === ''){
        console.log('bat无内容,取消执行');
        return;
    }
    try {
        // 写入临时文件
        writeFileSync(batPath, batContent);

        // 执行 .bat 文件
        const bat = new Promise((resolve, reject) => {
            exec(`"${batPath}"`, { encoding: 'utf8' }, (error, stdout, stderr) => {
                // 删除临时文件
                unlinkSync(batPath);

                if (error) {
                    console.log(stderr || error.message);
                } else {
                    console.log(stdout);
                }
            });
        });

        // dialog.showErrorBox('脚本运行结果',`Error: ${err.message}`);
    } catch (err) {
        dialog.showErrorBox('自启动脚本报错',`Error: ${err.message}`);
    }

}

module.exports = {
    executeBat
}