const { app,BrowserWindow,Menu,ipcMain } = require('electron');
const path = require('path');

process.env.NODE_ENV = 'dev';

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
  mainWin = new BrowserWindow({height:630,show:false,resizable:false,useContentSize:true});
  mainWin.once('ready-to-show',()=>{
    mainWin.show();
  });
  mainWin.once('closed',()=>{
    app.quit();
  });
  mainWin.loadFile(path.resolve(__dirname,'auth.html'));
});

ipcMain.on('entered',()=>{
  mainWin.loadFile(path.resolve(__dirname,'main.html'));
});

ipcMain.on('reset',()=>{
  mainWin.loadFile(path.resolve(__dirname,'reset.html'));
});

ipcMain.on('back',()=>{
  mainWin.loadFile(path.resolve(__dirname,'auth.html'));
});
