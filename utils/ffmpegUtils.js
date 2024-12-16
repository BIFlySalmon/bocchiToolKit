const { spawn, spawnSync } = require('child_process');
const { app } = require('electron');
const path = require('path');

// 获取 FFmpeg 路径，默认路径为当前项目的 resources 目录
function getFFmpegPath() {
    let FFmpeg;
    if (app.isPackaged) {
        FFmpeg = path.join(process.resourcesPath, 'ffmpeg', 'bin', 'ffmpeg.exe');
    } else {
        FFmpeg = path.join(process.cwd(), 'resources', 'ffmpeg', 'bin', 'ffmpeg.exe');
    }
    return FFmpeg;
}

/**
 * 同步执行 FFmpeg 命令
 * @param {string[]} args - FFmpeg 命令参数数组（不包括 ffmpeg 可执行文件）
 * @param {string} ffmpegPath - FFmpeg 可执行文件路径（可选）
 * @returns {Object} - 返回一个对象，包含执行结果或错误信息
 */
function executeFFmpegCommandSync(args, ffmpegPath = null) {
    const defaultFFmpegPath = getFFmpegPath();
    const executable = ffmpegPath || defaultFFmpegPath;

    // 使用 spawnSync 执行命令
    try {
        const result = spawnSync(executable, args, { encoding: 'utf-8' });
        
        if (result.error) {
            throw new Error(`Error executing FFmpeg command: ${result.error.message}`);
        }

        return {
            code: result.status,
            output: result.stdout,
            errorOutput: result.stderr
        };
    } catch (err) {
        throw new Error(`Failed to execute FFmpeg command: ${err.message}`);
    }
}

/**
 * 异步执行 FFmpeg 命令
 * @param {string[]} args - FFmpeg 命令参数数组（不包括 ffmpeg 可执行文件）
 * @param {string} ffmpegPath - FFmpeg 可执行文件路径（可选）
 * @returns {Promise<Object>} - 返回一个 Promise，包含执行结果或错误信息
 */
function executeFFmpegCommandAsync(args, ffmpegPath = null) {
    return new Promise((resolve, reject) => {
        const defaultFFmpegPath = getFFmpegPath();
        const executable = ffmpegPath || defaultFFmpegPath;

        // 创建子进程执行 FFmpeg
        const ffmpegProcess = spawn(executable, args);

        let output = '';
        let errorOutput = '';

        // 捕获标准输出
        ffmpegProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        // 捕获错误输出
        ffmpegProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        // 监听执行完成事件
        ffmpegProcess.on('close', (code) => {
            resolve({
                code,
                output,
                errorOutput
            });
        });

        // 监听错误事件
        ffmpegProcess.on('error', (err) => {
            reject(new Error(`Failed to start FFmpeg process: ${err.message}`));
        });
    });
}

module.exports = { 
    executeFFmpegCommandSync, 
    executeFFmpegCommandAsync 
};
