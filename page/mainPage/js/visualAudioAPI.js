
//获取子页面传入的数据,设置帧率
async function setVisualAudioFPS(obj){
    await window.settingsAPI.settingsSet('visualAudioFPS', obj);
    window.electronAPI.refreshWindows();
}

function getVisualAudioFPS(){
    return window.settingsAPI.settingsGet('visualAudioFPS');;
}
