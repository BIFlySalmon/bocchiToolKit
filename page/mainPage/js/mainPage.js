const radioButtons = document.querySelectorAll('input[name="option"]');
const fileInput = document.getElementById('file-input');
const urlInput = document.getElementById('url-input');
const bilibiliInput = document.getElementById('bilibili-input');
const bilibiliHint = document.getElementById('bilibili-hint');

document.addEventListener('DOMContentLoaded', () => {
    // 获取初始值
    const wallpaperType = window.settingsAPI.settingsGet('wallpaperType');
    const wallpaperPath = window.settingsAPI.settingsGet('wallpaperPath');

    // 定位元素
    const fileInput = document.getElementById('file-input');
    const urlInput = document.getElementById('url-input');
    const bilibiliInput = document.getElementById('bilibili-input');
    const bilibiliHint = document.getElementById('bilibili-hint');

    
    // 设置初始状态
    loadWallpaperSwitch();
    
    if (wallpaperType === 'img' || wallpaperType === 'video') {
        fileInput.style.display = 'flex';
        urlInput.style.display = 'none';
        bilibiliInput.style.display = 'none';
        bilibiliHint.style.display = 'none';
        document.getElementById('file-path').value = wallpaperPath || '';
        document.querySelector(`input[value="${wallpaperType}"]`).checked = true;
    } else if (wallpaperType === 'url') {
        fileInput.style.display = 'none';
        urlInput.style.display = 'flex';
        bilibiliInput.style.display = 'none';
        bilibiliHint.style.display = 'none';
        document.getElementById('url-path').value = wallpaperPath || '';
        document.querySelector(`input[value="url"]`).checked = true;
    } else if (wallpaperType === 'bilibili') {
        fileInput.style.display = 'none';
        urlInput.style.display = 'none';
        bilibiliInput.style.display = 'flex';
        bilibiliHint.style.display = 'block';
        document.getElementById('bilibili-id').value = wallpaperPath || '';
        document.querySelector(`input[value="bilibili"]`).checked = true;
    }

    // 监听切换事件
    const radioButtons = document.querySelectorAll('input[name="option"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            document.getElementById('file-path').value = '';
            document.getElementById('url-path').value='';
            document.getElementById('bilibili-id').value='';
            switch (radio.value) {
                case 'img':
                    fileInput.style.display = 'flex';
                    urlInput.style.display = 'none';
                    bilibiliInput.style.display = 'none';
                    bilibiliHint.style.display = 'none';
                    break;
                case 'video':
                    fileInput.style.display = 'flex';
                    urlInput.style.display = 'none';
                    bilibiliInput.style.display = 'none';
                    bilibiliHint.style.display = 'none';
                    break;
                case 'url':
                    fileInput.style.display = 'none';
                    urlInput.style.display = 'flex';
                    bilibiliInput.style.display = 'none';
                    bilibiliHint.style.display = 'none';
                    break;
                case 'bilibili':
                    fileInput.style.display = 'none';
                    urlInput.style.display = 'none';
                    bilibiliInput.style.display = 'flex';
                    bilibiliHint.style.display = 'block';
                    break;
            }
        });
    });
});


document.getElementById('selectFile').addEventListener('click', async () => {
    // 获取选中的类型
    const selectedType = document.querySelector('input[name="option"]:checked').value;

    const filePath = await window.fileAPI.openFile(selectedType);
    if (filePath) {
        // 将路径显示到输入框中
        document.getElementById('file-path').value = filePath;

        // 保存路径到 wallpaperPath
        // window.settingsAPI.settingsSet('wallpaperPath', filePath);
    } else {
        // alert('文件选择已取消');
    }
});

/**
 * 保存设置
 */
document.getElementById('settingsSend').addEventListener('click', () => {
    // 获取选中的类型
    const selectedType = document.querySelector('input[name="option"]:checked').value;
    
    // 根据选中的类型获取对应的路径值
    let pathValue = '';
    if (selectedType === 'img' || selectedType === 'video') {
        pathValue = document.getElementById('file-path').value.trim();
    } else if (selectedType === 'url') {
        pathValue = document.getElementById('url-path').value.trim();
    } else if (selectedType === 'bilibili') {
        pathValue = document.getElementById('bilibili-id').value.trim();
    }

    // 保存设置值
    if (selectedType && pathValue) {
        
        window.settingsAPI.settingsSet('wallpaperType', selectedType);
        window.settingsAPI.settingsSet('wallpaperPath', pathValue);

        // 提示用户保存成功
        alert('设置已保存！');

        loadWallpaperSwitch();
    } else {
        // 提示用户输入完整信息
        alert('请填写完整的路径信息！');
    }
});

document.getElementById('wallpaperOff').addEventListener('click', () => {
    window.settingsAPI.settingsSet('wallpaperSwitch', false);
    loadWallpaperSwitch();
});

document.getElementById('wallpaperOn').addEventListener('click', () => {
    window.settingsAPI.settingsSet('wallpaperSwitch', true);
    loadWallpaperSwitch();
});


//更新壁纸状态
function loadWallpaperSwitch(){
    const wallpaperSwitch = window.settingsAPI.settingsGet('wallpaperSwitch');
    document.getElementById('wallpaperOn').disabled = wallpaperSwitch;
    document.getElementById('wallpaperOff').disabled = !wallpaperSwitch;
    window.electronAPI.wallpaperRefresh();
}