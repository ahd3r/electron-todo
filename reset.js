const { ipcRenderer } = require('electron');
const helpers = require('./helper');

const users = JSON.parse(localStorage.getItem('users'));

document.querySelector('#resetF').addEventListener('submit',(e)=>{
  const name = document.querySelectorAll('#resetF>input')[0].value;
  const secret = document.querySelectorAll('#resetF>input')[1].value;
  const newPass = document.querySelectorAll('#resetF>input')[2].value;
  const confNewPass = document.querySelectorAll('#resetF>input')[3].value;
  const resUser = users.filter(user=>user.username===name);
  if(resUser.length===1 && newPass===confNewPass && resUser[0].secretWord===secret){
    users[users.indexOf(resUser[0])].password = newPass;
    localStorage.setItem('users',JSON.stringify(users));
    ipcRenderer.send('back');
  }else{
    helpers.showAlert('Wrong data','red');
    setTimeout(()=>{
      document.querySelector('.alert').remove();
    },3000);
  }
  e.preventDefault();
});

document.querySelector('.back').addEventListener('click',()=>{
  ipcRenderer.send('back');
});
