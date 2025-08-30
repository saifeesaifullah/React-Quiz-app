const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("wifiAPI", {
  getWifiList: () => ipcRenderer.invoke("get-wifi-list"),
  connectWifi: (data) => ipcRenderer.invoke("connect-wifi", data),
});
