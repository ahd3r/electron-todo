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
  helpers.delBtn();
  const list = document.createElement('ul');
  list.className = 'list-group';
  myTasks.forEach((myTask,ind)=>{
    const task = document.createElement('li');
    if(ind & 1){
      task.style.background='rgb(196, 196, 196)';
    }else{
      task.style.background='rgb(167, 167, 167)';
    }
    if(myTask.done){
      task.className = `list-group-item t-${tasks.indexOf(myTask)} done`;
    }else{
      task.className = `list-group-item t-${tasks.indexOf(myTask)}`;
    }
    task.appendChild(document.createElement('div'));
    task.querySelector('div').className='row';
    task.querySelector('.row').appendChild(document.createElement('div')).className='col-10';
    task.querySelector('.row').appendChild(document.createElement('div')).className='col text-right';
    task.querySelector('.row>.col-10').textContent = myTask.call;
    task.querySelector('.row>.col').appendChild(document.createElement('i')).className='material-icons';
    task.querySelector('.row>.col>.material-icons').textContent='edit';
    task.addEventListener('click',(e)=>{
      if(!document.querySelector('.close')){
        if(e.target.className==='material-icons'){
          helpers.formEdit(parseInt(e.target.parentElement.parentElement.parentElement.classList[1].slice(-1)),myTask.call);
        }else{
          if(tasks[parseInt(e.target.parentElement.parentElement.classList[1].slice(-1))].done){
            tasks[parseInt(e.target.parentElement.parentElement.classList[1].slice(-1))].done=false;
            task.className=`list-group-item t-${tasks.indexOf(myTask)}`;
          }else{
            tasks[parseInt(e.target.parentElement.parentElement.classList[1].slice(-1))].done=true;
            task.className=`list-group-item t-${tasks.indexOf(myTask)} done`;
          }
          localStorage.setItem('tasks',JSON.stringify(tasks));
          // ipcRenderer.send('entered');
        }
      }
    });
    task.addEventListener('dblclick',(e)=>{
      if(!document.querySelector('.close')){
        if(e.target.className!=='material-icons'){
          tasks.splice(parseInt(e.target.parentElement.parentElement.classList[1].slice(-1)),1);
          localStorage.setItem('tasks',JSON.stringify(tasks));
          ipcRenderer.send('entered');
        }
      }
    });
    list.appendChild(task);
  });
  document.querySelector('#tasksPlace').appendChild(list);
}

document.querySelector('#addTask').addEventListener('submit',(e)=>{
  const allMyTasks = tasks.filter(task=>{
    if(task.user === curUserId){
      return true
    }
  });
  const taskCall = document.querySelector('#addTask>div>input').value;
  if(taskCall && taskCall.length<=40 && allMyTasks.length<20){
    tasks.push({call:taskCall,done:false,user:curUserId});
    localStorage.setItem('tasks',JSON.stringify(tasks));
    ipcRenderer.send('entered');
  }else if(allMyTasks.length>=20){
    helpers.showAlert('Make it less, Slavik)','red');
    setTimeout(()=>{
      document.querySelector('.alert').remove();
    },3000);
  }else if(taskCall.length>40){
    helpers.showAlert('Make it less, Slavik)','red');
    setTimeout(()=>{
      document.querySelector('.alert').remove();
    },3000);
  }else if(!taskCall){
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

if(document.querySelector('#delAll') && document.querySelector('#delDone')){
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
}
