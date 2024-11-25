const sudo = require('sudo-prompt');
const { execSync, exec } = require('child_process');
const { dialog } = require('electron');
const { mainPage }  = require('./windowManager');

function execWithSudo(command) {
    return new Promise((resolve, reject) => {
        sudo.exec(command, { name: 'Toggle Device' }, (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing command: ${stderr || error.message}`);
                return;
            }
            resolve(stdout);
        });
    });
}

async function getServiceStatus() {
    try {
        const output = execSync('sc qc i8042prt | find "START_TYPE"').toString();
        const startTypeMatch = output.match(/START_TYPE\s+:\s+\d+\s+(\w+)/);
        if (!startTypeMatch) {
            throw new Error("Unable to parse START_TYPE from output.");
        }
        const currentState = startTypeMatch[1].toLowerCase(); 
        return currentState;
    } catch (error) {
        throw new Error(`Failed to get service status: ${error.message}`);
    }
}

async function setServiceStatus(newState) {
    try {
        const configCommand = `sc config i8042prt start= ${newState}`;
        await execWithSudo(configCommand);
        return newState;
    } catch (error) {
        throw new Error(`Failed to set service status: ${error.message}`);
    }
}

async function toggleDevice() {
    try {
        const currentState = await getServiceStatus();
        const newState = currentState === "disabled" ? "auto" : "disabled";
        const updatedState = await setServiceStatus(newState);
        return (updatedState === "disabled");
    } catch (error) {
        throw new Error(`Failed to toggle service: ${error.message}`);
    }
}

async function isReBoot(){
    const result = await dialog.showMessageBox(mainPage, {
        type: 'warning',
        buttons: ['立!即!重!启!', '稍后我自行重启'], 
        defaultId: 1, 
        cancelId: 1, 
        title: '确认重启',
        message: "重启后生效，是否确认重启(快看看有没有没保存的东西!!!)",
    });
    // console.log(result.response);
    if (result.response === 0){
        try {
            exec("shutdown /r /t 0", (error) => {
            if (error) {
                console.error('Failed to restart the computer:', error);
            }
            });
        } catch (err) {
            console.error('Error executing restart command:', err);
        }
    }
    return result.response;
}
module.exports = {
    getServiceStatus,
    setServiceStatus,
    toggleDevice,
    isReBoot
}