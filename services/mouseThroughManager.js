const { app, BrowserWindow } = require('electron');
/**
 * 修复electron窗口在另一个鼠标穿透窗口上方拖动时异常闪烁的问题
 */
class MouseThroughManager {
    constructor() {
        this.mouseThroughWindows = [];
        this._initializeWindowListeners();
    }

    addWindow(win) {
        if (!this.mouseThroughWindows.includes(win)) {
            win.setIgnoreMouseEvents(true, { forward: true });
            this.mouseThroughWindows.push(win);
        }
    }

    removeWindow(win) {
        const index = this.mouseThroughWindows.indexOf(win);
        if (index !== -1) {
            this.mouseThroughWindows.splice(index, 1);
        }
    }

    _disableMouseEvents() {
        this.mouseThroughWindows.forEach(win => {
            win.setIgnoreMouseEvents(true);
        });
    }

    

    _enableMouseEvents() {
        this.mouseThroughWindows.forEach(win => {
            win.setIgnoreMouseEvents(true, { forward: true });
        });
    }

    _initializeWindowListeners() {
        const windows = BrowserWindow.getAllWindows();
        windows.forEach(win => this._setupDragHandlers(win));

        app.on('browser-window-created', (_, win) => {
            this._setupDragHandlers(win);
        });

        app.on('browser-window-closed', (_, win) => {
            this._removeWindowListeners(win);
        });
    }

    _setupDragHandlers(win) {
        // 监听拖动开始
        win.on('will-move', () => {
            this._disableMouseEvents();
        });
    
        // 监听拖动结束
        win.on('moved', () => {
            this._enableMouseEvents();
        });
    
        // 监听调整大小开始
        win.on('will-resize', () => {
            this._disableMouseEvents();
        });
    
        // 监听调整大小结束
        win.on('resized', () => {
            this._enableMouseEvents();
        });
    
        win.on('closed', () => {
            this.removeWindow(win);
        });
    }
    

    _removeWindowListeners(win) {
        this.removeWindow(win);
    }


}

module.exports = new MouseThroughManager();
