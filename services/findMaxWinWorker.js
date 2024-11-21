const { HasMaximizedWindow } = require('../dllCall/maxWindowFind');
const { storeManager } = require('./storeManager');

let flag = false;
let firstTimeEnabled = true;
let intervalId = null;

function startfindMaxWinMonitoring(backgroundPage) {
    if (intervalId) return; // Prevent multiple intervals

    intervalId = setInterval(() => {
        if (storeManager.get('pauseSwitch')){
            if (!firstTimeEnabled){
                firstTimeEnabled = true;
            }
            try {
                const result = HasMaximizedWindow() === 0 ? false : true;
                if (flag !== result) {
                    flag = result;
                    backgroundPage.webContents.send('findMaxWinMsg', { data: result }); 
                }
            } catch (err) {
                console.error('Error calling HasMaximizedWindow:', err);
            }
        } else {
            if (firstTimeEnabled){
                backgroundPage.webContents.send('findMaxWinMsg', { data: false });
                firstTimeEnabled = false
                flag = false;
            }
        }
    }, 3000); 
}

function stopfindMaxWinMonitoring() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null; 
    }
}

module.exports = {
    startfindMaxWinMonitoring,
    stopfindMaxWinMonitoring
}
