const { app,BrowserWindow,Menu,ipcMain } = require('electron');
const url = require('url');
const path = require('path');

process.env.NODE_ENV = 'prod';

let mainWin;
const devMenu = [{
  label:'DevTools',
  click(items,focusedWindow,keyboard){
    focusedWindow.toggleDevTools();
  }
}];

app.on('ready',()=>{
  if(process.env.NODE_ENV==='dev'){
    Menu.setApplicationMenu(Menu.buildFromTemplate(devMenu));
  }else if(process.env.NODE_ENV==='prod'){
    Menu.setApplicationMenu(null);
  }
  mainWin = new BrowserWindow({});
  mainWin.loadURL(url.format({
    protocol:'file',
    pathname: path.resolve(__dirname,'auth.html')
  }));
});

ipcMain.on('entered',()=>{
  mainWin.loadURL(url.format({
    protocol:'file',
    pathname: path.resolve(__dirname,'main.html')
  }));
});

ipcMain.on('reset',()=>{
  mainWin.loadURL(url.format({
    protocol:'file',
    pathname: path.resolve(__dirname,'reset.html')
  }));
});

ipcMain.on('back',()=>{
  mainWin.loadURL(url.format({
    protocol:'file',
    pathname: path.resolve(__dirname,'auth.html')
  }));
});
