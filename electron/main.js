import { app,BrowserWindow,ipcMain } from "electron";
import path from "path";
import { exec } from "child_process";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirfilename = fileURLToPath(import.meta.url)
const __dirname = dirname(__dirfilename);

function createWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
  createWindow();
});

ipcMain.handle("get-wifi-list", async () => {
  return new Promise((resolve) => {
    exec("netsh wlan show networks mode=bssid", (err, stdout) => {
      if (err) return resolve([]);
      const networks = [...stdout.matchAll(/SSID \d+ : (.+)/g)].map(
        (m) => m[1]
      );
      resolve(networks);
    });
  });
});

ipcMain.handle("connect-wifi", async (event, { ssid, password }) => {
  return new Promise((resolve) => {
    const profile = `<?xml version=\"1.0\"?>
<WLANProfile xmlns=\"http://www.microsoft.com/networking/WLAN/profile/v1\">
  <name>${ssid}</name>
  <SSIDConfig><SSID><name>${ssid}</name></SSID></SSIDConfig>
  <connectionType>ESS</connectionType>
  <connectionMode>auto</connectionMode>
  <MSM>
    <security>
      <authEncryption>
        <authentication>WPA2PSK</authentication>
        <encryption>AES</encryption>
        <useOneX>false</useOneX>
      </authEncryption>
      <sharedKey>
        <keyType>passPhrase</keyType>
        <protected>false</protected>
        <keyMaterial>${password}</keyMaterial>
      </sharedKey>
    </security>
  </MSM>
</WLANProfile>`;

    const fs = require("fs");
    const tmp = path.join(app.getPath("temp"), `${ssid}.xml`);
    fs.writeFileSync(tmp, profile);

    exec(`netsh wlan add profile filename=\"${tmp}\"`, () => {
      exec(`netsh wlan connect name=\"${ssid}\"`, (err) => {
        resolve(!err);
      });
    });
  });
});
