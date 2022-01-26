const { contextBridge, ipcRenderer } = require('electron');

ipcRenderer.on('preload', (_, preload) => require(preload));
ipcRenderer.send('preload-loaded');

document.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html');
    if (getComputedStyle(html).backgroundColor == 'rgba(0, 0, 0, 0)')
        html.style.backgroundColor = 'white';
});

contextBridge.exposeInMainWorld('nodejs', {
    channel: {
        on: (channel, callback) => ipcRenderer.on(channel, callback),
        post: (channel, message) => ipcRenderer.send(channel, message)
    }
});

contextBridge.exposeInMainWorld('wrapper', {
    changeBackground: color => ipcRenderer.send('changeBackground', color),
    changeForeground: color => ipcRenderer.send('changeForeground', color),
    changeForegroundHover: color => ipcRenderer.send('changeForegroundHover', color)
});