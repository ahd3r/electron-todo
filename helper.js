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
}

module.exports = new Help;
