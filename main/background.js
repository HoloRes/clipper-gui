import { app, ipcMain, session } from 'electron';
import serve from 'electron-serve';
import { ElectronBlocker } from '@cliqz/adblocker-electron';
import fetch from 'cross-fetch';
import updater from 'update-electron-app';
import Store from 'electron-store';
import path from 'path';
import { createWindow } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

const store = new Store();

updater();

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    height: 600,
    width: 1000,
    // eslint-disable-next-line sort-keys
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      preload: path.join(__dirname, '../main/helpers/preload.js'),
    },
  });

  ipcMain.on('getDarkMode', () => {
    const data = store.get('darkMode');
    mainWindow.webContents.send('getDarkMode', data);
  });

  ipcMain.on('setDarkMode', (event, value) => {
    return store.set('darkMode', value);
  });

  // TODO: Clip request and progress update
  ipcMain.on('startClipping', (event, options) => {
    /*
     * options: {
     *   url: string,
     *   timestamps: Array<Timestamp> // [[0, 1], [0,1]]
     *   stitchClips: boolean
     *   rescaleVideo: boolean
     * }
     */
  });

  // * Progress updates should be done using `mainWindow.webContents.send('progressUpdate', number)`

  ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then(blocker => {
    blocker.enableBlockingInSession(session.defaultSession);
  });

  if (isProd) {
    mainWindow.removeMenu();
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
