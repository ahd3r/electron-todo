const { ipcRenderer } =require('electron');
const helpers = require('./helper');

const curUserId = parseInt(localStorage.getItem('current'));
const users = JSON.parse(localStorage.getItem('users'));
const tasks = JSON.parse(localStorage.getItem('tasks'));

const myUsername = document.createElement('a');
myUsername.className = 'nav-item nav-link mr-auto';
myUsername.textContent = users[curUserId].username;
document.querySelector('nav').insertBefore(myUsername,document.querySelector('a'));

let myTasks = tasks.filter(task=>{
  if(task.user === curUserId){
    return true
  }
});
myTasks=myTasks.reverse();

if(myTasks.length===0){
  const text = document.createElement('p');
  text.className = 'text-center';
  text.textContent = 'No tasks';
  document.querySelector('#tasksPlace').appendChild(text);
}else{
  if(myTasks.length>5){
    helpers.pagination(myTasks);
    const page = localStorage.getItem('page');
    if(!page){
      myTasks=myTasks.slice(0,5);
    }else{
      myTasks=myTasks.slice(parseInt(page)*5-5,parseInt(page)*5);
    }
  }
  const list = document.createElement('ul');
  list.className = 'list-group';
  myTasks.forEach((myTask,ind)=>{
    const task = document.createElement('li');
    if(myTask.done){
      task.className = `list-group-item t-${tasks.indexOf(myTask)} done`;
    }else{
      task.className = `list-group-item t-${tasks.indexOf(myTask)}`;
    }
    task.textContent = myTask.call;
    task.addEventListener('click',(e)=>{
      if(tasks[parseInt(e.target.classList[1].slice(-1))].done){
        tasks[parseInt(e.target.classList[1].slice(-1))].done=false;
      }else{
        tasks[parseInt(e.target.classList[1].slice(-1))].done=true;
      }
      localStorage.setItem('tasks',JSON.stringify(tasks));
      ipcRenderer.send('entered');
    });
    task.addEventListener('dblclick',(e)=>{
      tasks.splice(parseInt(e.target.classList[1].slice(-1)),1);
      localStorage.setItem('tasks',JSON.stringify(tasks));
      ipcRenderer.send('entered');
    });
    list.appendChild(task);
  });
  document.querySelector('#tasksPlace').appendChild(list);
}

document.querySelector('#addTask').addEventListener('submit',(e)=>{
  const taskCall = document.querySelector('#addTask>div>input').value;
  if(taskCall){
    tasks.push({call:taskCall,done:false,user:curUserId});
    localStorage.setItem('tasks',JSON.stringify(tasks));
    ipcRenderer.send('entered');
  }else{
    helpers.showAlert('Type some call for task','red');
    setTimeout(()=>{
      document.querySelector('.alert').remove();
    },3000);
  }
  e.preventDefault();
});

document.querySelector('#logoutP').addEventListener('click',()=>{
  localStorage.setItem('current','-1');
  ipcRenderer.send('back');
});

document.querySelector('#delAll').addEventListener('click',()=>{
  const withoutMyTasks = tasks.filter(task=>{
    if(task.user!==curUserId){
      return true
    }
  });
  localStorage.setItem('tasks',JSON.stringify(withoutMyTasks));
  ipcRenderer.send('entered');
});

document.querySelector('#delDone').addEventListener('click',()=>{
  const withoutMyDone=tasks.filter(task=>{
    if(task.user!==curUserId || !task.done){
      return true
    }
  });
  localStorage.setItem('tasks',JSON.stringify(withoutMyDone));
  ipcRenderer.send('entered');
});
