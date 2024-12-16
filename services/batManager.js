const { app, dialog } = require('electron');
const { writeFileSync, unlinkSync } = require('fs');
const { join } = require('path');
const { exec } = require('child_process');
const { storeManager } = require('./storeManager');
const iconv = require('iconv-lite');

function executeBat() {

    const batContent = storeManager.get('autoLaunthBat');
    const batPath = join(app.getPath('temp'), 'temp_script.bat');

    // console.log(batPath);
    if (batContent.trim() === ''){
        console.log('bat无内容,取消执行');
        return;
    }
    try {
        // 将内容转换为 ANSI（例如 GBK）
        const buffer = iconv.encode(batContent, 'GBK'); // 或 'gbk' 取决于具体需求
        writeFileSync(batPath, buffer);

        // 执行 .bat 文件
        const bat = new Promise((resolve, reject) => {
            exec(`"${batPath}"`, { encoding: 'GBK' }, (error, stdout, stderr) => {
                // 删除临时文件
                unlinkSync(batPath);

                if (error) {
                    console.log(iconv.decode(stderr, 'GBK') || error.message );
                } else {
                    console.log(iconv.decode(stdout, 'GBK'));
                }
            });
        });

        // dialog.showErrorBox('脚本运行结果',`Error: ${err.message}`);
    } catch (err) {
        dialog.showErrorBox('自启动脚本报错',`Error: ${err.message}`);
    }

}




function openVersion(){
    exec('start https://github.com/BIFlySalmon/bocchiToolKitUpdate/releases');
}


module.exports = {
    executeBat,
    openVersion
}