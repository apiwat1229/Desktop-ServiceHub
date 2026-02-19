"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  storage: {
    get: (key) => electron.ipcRenderer.sendSync("electron-store-get", key),
    set: (key, value) => electron.ipcRenderer.send("electron-store-set", key, value),
    delete: (key) => electron.ipcRenderer.send("electron-store-delete", key)
  },
  // Window Controls
  window: {
    minimize: () => electron.ipcRenderer.send("window-minimize"),
    maximize: () => electron.ipcRenderer.send("window-maximize"),
    close: () => electron.ipcRenderer.send("window-close")
  },
  // Auto-Update APIs
  autoUpdate: {
    checkForUpdates: () => electron.ipcRenderer.send("check-for-updates"),
    downloadUpdate: () => electron.ipcRenderer.send("download-update"),
    installUpdate: () => electron.ipcRenderer.send("install-update"),
    onChecking: (callback) => {
      electron.ipcRenderer.on("update-checking", callback);
      return () => electron.ipcRenderer.removeListener("update-checking", callback);
    },
    onUpdateAvailable: (callback) => {
      electron.ipcRenderer.on("update-available", (_event, info) => callback(info));
      return () => electron.ipcRenderer.removeAllListeners("update-available");
    },
    onUpdateNotAvailable: (callback) => {
      electron.ipcRenderer.on("update-not-available", (_event, info) => callback(info));
      return () => electron.ipcRenderer.removeAllListeners("update-not-available");
    },
    onDownloadProgress: (callback) => {
      electron.ipcRenderer.on("download-progress", (_event, progress) => callback(progress));
      return () => electron.ipcRenderer.removeAllListeners("download-progress");
    },
    onUpdateDownloaded: (callback) => {
      electron.ipcRenderer.on("update-downloaded", (_event, info) => callback(info));
      return () => electron.ipcRenderer.removeAllListeners("update-downloaded");
    },
    onError: (callback) => {
      electron.ipcRenderer.on("update-error", (_event, error) => callback(error));
      return () => electron.ipcRenderer.removeAllListeners("update-error");
    }
  }
  // You can expose other APTs you need here.
  // ...
});
