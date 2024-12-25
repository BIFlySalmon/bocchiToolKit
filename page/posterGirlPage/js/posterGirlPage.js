window.live2d.onNextLive2D((event, flag) => {
    document.getElementById('waifu-tool-switch-model').click();
});

document.addEventListener('DOMContentLoaded', () => {

    const waifu =  window.settingsAPI.settingsGet('posterGirlOnOff');
    const visualAudio = window.settingsAPI.settingsGet('visualAudio');

    document.getElementById('waifu').style.visibility = waifu === false?'hidden':'visible';
    document.getElementById('visualAudioPage').style.visibility = visualAudio === false?'hidden':'visible';
    
});