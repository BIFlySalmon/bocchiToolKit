
const { storeManager } = require('./storeManager');
const { refreshWindows, getlive2dPath, nextLive2D } = require('./posterGirlManager');

function setVisualAudio(){
    let isEnabled = storeManager.get('visualAudio');
    storeManager.set('visualAudio', !isEnabled);
    refreshWindows();
    return storeManager.get('visualAudio');;
}

module.exports ={
    setVisualAudio
}