const path = require('node:path');
const { app } = require('electron');

// 使用路径确保加载的是项目的 package.json
const packageJson = require(path.join(app.getAppPath(), 'package.json'));

function getVersion(){
    return packageJson.version;
}

function getAuthor(){
    return packageJson.author;
}

module.exports= {
    getVersion,
    getAuthor
}