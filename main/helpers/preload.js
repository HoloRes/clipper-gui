//* From: https://github.com/reZach/secure-electron-template
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  receive: (channel, func) => {
    const validChannels = ['getDarkMode', 'progressUpdate'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  send: (channel, data) => {
    const validChannels = ['setDarkMode', 'getDarkMode', 'startClipping'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
});
