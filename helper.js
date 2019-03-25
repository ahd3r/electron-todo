const { ipcRenderer } = require('electron');

class Help{
  showAlert(msg,color){
    const alert = document.createElement('div');
    if(color==='red'){
      alert.className='text-center alert alert-danger mb-2';
    }else if(color==='green'){
      alert.className='text-center alert alert-success mb-2';
    }else if(color==='dark'){
      alert.className='text-center alert alert-dark mb-2';
    }else if(color==='blue'){
      alert.className='text-center alert alert-info mb-2';
    }
    alert.textContent = msg;
    document.querySelector('body').insertBefore(alert,document.querySelector('.container'));
  }
  pagination(allMyTasksArr){
    const page = Math.ceil(allMyTasksArr.length/5);
    const pag = document.createElement('nav');
    pag.className='mb-3';
    pag.appendChild(document.createElement('ul')).className='pagination justify-content-center';
    for(let i=1;i<=page;i++){
      const list = document.createElement('li');
      list.className='page-item';
      list.appendChild(document.createElement('a')).className='page-link';
      list.querySelector('a').textContent=i;
      list.addEventListener('click',(e)=>{
        localStorage.setItem('page',e.target.firstChild.textContent);
        ipcRenderer.send('entered');
      });
      pag.querySelector('ul').appendChild(list);
    }
    document.querySelector('body').insertBefore(pag,document.querySelector('script'));
  }
  delBtn(){
    const btn = document.createElement('div');
    btn.className='row';
    const delAll = document.createElement('div');
    delAll.className = 'col text-right';
    delAll.appendChild(document.createElement('a')).textContent = 'Delete All';
    delAll.querySelector('a').className='btn btn-light';
    delAll.querySelector('a').setAttribute('id','delAll');
    const delDone = document.createElement('div');
    delDone.className = 'col';
    delDone.appendChild(document.createElement('a')).textContent = 'Delete Done';
    delDone.querySelector('a').className='btn btn-light';
    delDone.querySelector('a').setAttribute('id','delDone');
    btn.appendChild(delAll);
    btn.appendChild(delDone);
    document.querySelector('.container').insertBefore(btn,document.querySelector('#linear'));
  }
  formEdit(taskId,calling){
    while(document.querySelector(`.t-${taskId}>.row`).firstChild){
      document.querySelector(`.t-${taskId}>.row`).firstChild.remove();
    }
    document.querySelector(`.t-${taskId}>.row`).appendChild(document.createElement('div')).className='col-10';
    document.querySelector(`.t-${taskId}>.row`).appendChild(document.createElement('div')).className='col text-right';
    const form = document.createElement('form');
    form.className = 'editT form-inline';
    form.appendChild(document.createElement('input')).className='form-control';
    form.querySelector('.form-control').value = calling;
    form.querySelector('.form-control').setAttribute('type','text');
    form.querySelector('.form-control').setAttribute('placeholder','New task call');
    form.appendChild(document.createElement('button')).appendChild(document.createElement('i')).className='material-icons';
    form.querySelector('.material-icons').textContent='done';
    form.querySelector('button').className='btn';
    form.querySelector('button').type='submit';
    document.querySelector(`.t-${taskId}>.row>.col-10`).appendChild(form);
    document.querySelector(`.t-${taskId}>.row>.col`).appendChild(document.createElement('i')).className='material-icons close';
    document.querySelector(`.t-${taskId}>.row>.col>.material-icons`).textContent='close';
    document.querySelector('.editT').addEventListener('submit',(e)=>{
      const newCall = document.querySelector('.editT>.form-control').value;
      if(newCall && newCall.length <= 40){
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks[taskId].call=newCall;
        localStorage.setItem('tasks',JSON.stringify(tasks));
        ipcRenderer.send('entered');
      }else if(newCall.length>40){
        this.showAlert('Make it less','red');
        setTimeout(()=>{
          document.querySelector('.alert').remove();
        },3000);
      }else{
        this.showAlert('Must be some text','red');
        setTimeout(()=>{
          document.querySelector('.alert').remove();
        },3000);
      }
      e.preventDefault();
    });
    document.querySelector('.close').addEventListener('click',()=>{
      ipcRenderer.send('entered');
    });
  }
}

module.exports = new Help;
