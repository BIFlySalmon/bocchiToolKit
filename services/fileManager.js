const { dialog } = require('electron');
const path = require('path');
const fs = require('fs');


async function wallpaperFileSelect(mainPage, selectedType){
    const result = await dialog.showOpenDialog(mainPage, {
        title: '选择文件',
        properties: ['openFile'], // 仅允许选择文件
        filters: [
            // { name: '所有文件', extensions: ['*'] },
            selectedType === 'img'
            ?
            { name: '图片文件', extensions: ['png', 'jpg', 'jpeg', 'gif'] }
            :
            { name: '视频文件', extensions: ['mp4', 'mkv', 'avi'] }
        ],
    });
    if (result.canceled) {
        return null;
    }
    
    const filePath = result.filePaths[0];
    
    // 进一步验证文件是否存在
    if (!fs.existsSync(filePath)) {
        dialog.showErrorBox('路径错误', '路径下未找到文件');
        return null;
    }else{

        if (selectedType === 'img'){
            // 检查文件类型
            if (filePath.toLowerCase().endsWith('.png') 
                || filePath.toLowerCase().endsWith('.jpg') 
                || filePath.toLowerCase().endsWith('.jpeg') 
                || filePath.toLowerCase().endsWith('.gif')
            ) {
                return filePath;
            }
        }else{
            // 检查文件类型
            if (filePath.toLowerCase().endsWith('.mp4') 
                || filePath.toLowerCase().endsWith('.mkv') 
                || filePath.toLowerCase().endsWith('.avi')
            ) {
                return filePath;
            }
        }

        dialog.showErrorBox('文件类型不符', '暂不支持' + path.extname(filePath).toLowerCase() + '类型文件~');
        return null;
    }

}


module.exports = { 
    wallpaperFileSelect 
};