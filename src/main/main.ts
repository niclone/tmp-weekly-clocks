/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, Notification, Tray, Menu, nativeImage } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
//import tray from './tray';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    //await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

/*
 * Code nico
 **/

const store = new Store({ name: 'horloge-de-classe' });

// IPC listener
ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
  event.returnValue = store.get(val);
  setupAlarms();
  new Notification({ title: "saved", body: "le truc à bien été sauvé, alors fait pas iech" }).show();
});

// search next alarm
const moment = require('moment');
const cron = require('node-cron');

interface AlarmTime {
  id: string;
  t: string;
  day: number;
}

interface Croned {
  at: AlarmTime;
  task: object;
}

const musica = () => {
  console.log('musica !');
  //showNotification();
  new Notification({ title: "fuck", body: "c'est l'heure !" }).show();

};

const setupAlarms = () => {
  const savedstr = store.get('times');
  let saved;
  if (savedstr === undefined) saved = new Map();
  else saved = JSON.parse(savedstr);

  if (typeof(saved) !== 'object') {
    saved = {};
    store.set('times', {});
  }

  console.log(" =============== setupAlarms ============== ", saved.length);

  const addCron = (at: AlarmTime) => {
    const [hour, minute] = at.t.split(':');
    cron.schedule(
      `${minute} ${hour} * * ${at.day}`,
      () => {
        musica();
      },
      {
        name: at.id,
        at,
      }
    );
  };

  // check existing tasks
  const tasks = cron.getTasks();
  tasks.forEach((task: any) => {
    const id = task.options.name;
    const savedat = saved[id];
    console.log("check task : ", id, savedat !== undefined ? 'yes' : 'no');
    if (savedat === undefined) {
      // remove this active task that doest not exists anymore
      task.stop();
      tasks.delete(id);
      console.log("   - deleted : ", id, tasks.get(id) === undefined, cron.getTasks().get(id) === undefined);
    } else if (JSON.stringify(savedat) !== JSON.stringify(task.options.at)) {
      // update changed task
      task.stop();
      tasks.delete(id);
      addCron(savedat);
      console.log("   - modified : ", id);
    }
  });

  // check for new tasks
  Object.values(saved).forEach((at: AlarmTime) => {
    if (tasks.get(at.id) === undefined) {
      addCron(at);
      console.log("   - created : ", at.id, tasks.get(at.id) === undefined, cron.getTasks().get(at.id) === undefined);
    }
  });

  console.log("saved: ", saved);
  console.log("tasks: ", cron.getTasks().keys());
};


//const { app, Tray, Menu, nativeImage } = require('electron');

let tray;
app
  .whenReady()
  .then(() => {
    const icon = nativeImage.createFromPath('assets/alarm-clock.png');
    console.log("icon: ", icon.getSize());
    //tray = new Tray('⏰');
    tray = new Tray(icon);

    // note: votre code contextMenu, Tooltip and Title ira ici!
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Item1', type: 'radio' },
      { label: 'Item2', type: 'radio' },
      { label: 'Item3', type: 'radio', checked: true },
      { label: 'Item4', type: 'radio' },
    ]);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Ceci est mon application');
    tray.setTitle('Ceci est mon titre');
    //return null;
  })
  .catch((e) => {
    console.error("TRAY ERROOOOOOOOOOOOOOR", e);
  });


setupAlarms();
//tray();
