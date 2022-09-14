const { app, ipcMain } = require('electron')
const Store = require('electron-store');

const store = new Store();

ipcMain.on('useElectronStore-get', async (event, arg) => {
  console.log('useElectronStore-get', arg); // prints "heyyyy ping"
  event.returnValue = store.get(arg);
  console.log('useElectronStore-get v:', event.returnValue);
});

ipcMain.on('useElectronStore-set', (event, arg) => {
  console.log('useElectronStore-set', arg);
  store.set(arg.key, arg.value);
});

export default null;
