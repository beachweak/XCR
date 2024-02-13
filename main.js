const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Remember to consider security implications
      enableRemoteModule: false, // The 'remote' module is not recommended; hence, we disable it here
    },
    icon: getPlatformIconPath(),
  });

  mainWindow.setMinimumSize(1000, 600);

  mainWindow.setTitle('XCR - Electron Client');
  mainWindow.setMenu(null);

  if (process.platform === 'darwin') {
    app.dock.setIcon(getPlatformIconPath());
  }

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function getPlatformIconPath() {
  if (process.platform === 'darwin') {
    return path.join(__dirname, 'images/xcr.png');
  } else {
    return path.join(__dirname, 'images/xcr.ico');
  }
}

// Event handlers for window control actions
ipcMain.on('window-minimize', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});