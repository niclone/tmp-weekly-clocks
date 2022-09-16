const { app, Tray, Menu, nativeImage } = require('electron');

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
    return null;
  })
  .catch((e) => {
    console.error(e);
  });

export default () => {
  console.log("ok");
};
