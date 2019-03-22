const { ipcRenderer } = require('electron');
const helpers = require('./helper');

const tasks = JSON.parse(localStorage.getItem('tasks'));
const users = JSON.parse(localStorage.getItem('users'));
const curUser = parseInt(localStorage.getItem('current'));

localStorage.setItem('page','1');

if(!tasks){
  localStorage.setItem('tasks','[]');
}
if(!users){
  localStorage.setItem('users','[]');
}
if(curUser!==0 && !curUser){
  localStorage.setItem('current','-1');
}

if(curUser!==-1){
  ipcRenderer.send('entered');
}

const usernames = [];
users.forEach((user,index)=>{
  usernames.push(user.username);
});

document.querySelector('#signupF').addEventListener('submit',(e)=>{
  const name = document.querySelectorAll('#signupF>input')[0].value;
  const secret = document.querySelectorAll('#signupF>input')[1].value;
  const pass = document.querySelectorAll('#signupF>input')[2].value;
  const confPass = document.querySelectorAll('#signupF>input')[3].value;
  if(pass && name && secret && pass===confPass && usernames.indexOf(name)===-1){
    users.push({username:name, password:pass, secretWord:secret});
    localStorage.setItem('users',JSON.stringify(users));
    localStorage.setItem('current',`${users.length-1}`);
    ipcRenderer.send('entered');
  }else{
    helpers.showAlert('Wrong data','red');
    setTimeout(()=>{
      document.querySelector('.alert').remove();
    },3000);
  }
  e.preventDefault();
});

document.querySelector('#loginF').addEventListener('submit',(e)=>{
  const name = document.querySelectorAll('#loginF>input')[0].value;
  const pass = document.querySelectorAll('#loginF>input')[1].value;
  if(usernames.indexOf(name)!==-1){
    if(users[usernames.indexOf(name)].password===pass){
      localStorage.setItem('current',`${usernames.indexOf(name)}`);
      ipcRenderer.send('entered');
    }else{
      helpers.showAlert('Wrong data','red');
      setTimeout(()=>{
        document.querySelector('.alert').remove();
      },3000);
    }
  }else{
    helpers.showAlert('Wrong data','red');
    setTimeout(()=>{
      document.querySelector('.alert').remove();
    },3000);
  }
  e.preventDefault();
});

document.querySelector('#forgetPass').addEventListener('click',()=>{
  ipcRenderer.send('reset');
});
