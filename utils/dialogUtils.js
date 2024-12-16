const { dialog } = require('electron');
const { mainPage } = require('../services/windowManager');

function showMessageBox(win, type, buttons, defaultId, cancelId, title, message){
    const result = dialog.showMessageBox(win ==='mainPage'? mainPage: win, {
        type: type,
        buttons: buttons, 
        defaultId: defaultId, 
        cancelId: cancelId, 
        title: title,
        message: message,
    });
    return result;
}

module.exports = {
    showMessageBox
}