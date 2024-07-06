const { contextBridge, ipcRenderer } = require('electron');

// メインプロセスから渡されるモジュールを定義
contextBridge.exposeInMainWorld(
    'electron',
    {
        // IPCレンダラーを公開
        ipcRenderer: ipcRenderer,
        // その他のモジュールをここで追加
        requires: {
            matterjs: window.require('matter-js')
        }
    }
);
