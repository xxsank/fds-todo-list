import axios from 'axios';

const postAPI = axios.create({
  baseURL: process.env.API_URL
});
const rootEl = document.querySelector('.root');

const templates = {
  todoListEl: document.querySelector('#todo-list').content,
  todoItemEl: document.querySelector('#todo-item').content,
  modifyFormEl: document.querySelector('#modify-form').content
}

function render(fragment){
  rootEl.textContent = "";  
  rootEl.appendChild(fragment);
}

async function indexPage(){
  const res = await postAPI.get('/todos');
  const listFragment = document.importNode(templates.todoListEl,true);
  const formEl = listFragment.querySelector('.todo-list__form');
  const modifyFragment = document.importNode(templates.modifyFormEl,true);

  
  res.data.forEach(post => {
    const bodyFragment = document.importNode(templates.todoItemEl,true);
    const bodyEl = bodyFragment.querySelector('.todo-list__body');
    const deleteEl = bodyFragment.querySelector('.todo-list__remove-btn');
    const modifyEl = bodyFragment.querySelector('.todo-list__modify-btn');
    const completeEl = bodyFragment.querySelector('.todo-list__complete-btn');
    const modifyFragment = document.importNode(templates.modifyFormEl,true);
    const modifyBtnEl = modifyFragment.querySelector('.modify__form');
    const modifyCancelBtnEl = modifyFragment.querySelector('.modify-cancel__btn');

    listFragment.appendChild(bodyEl).textContent = post.body;

    listFragment.appendChild(completeEl);
    listFragment.appendChild(modifyEl);
    listFragment.appendChild(deleteEl);

    if(post.complete === true){
      bodyEl.classList.add('complete-body');      
    }
    
    deleteEl.addEventListener('click', async e =>{
      bodyEl.remove();
      completeEl.remove();
      modifyEl.remove();
      deleteEl.remove();
      const res = await postAPI.delete(`/todos/${post.id}`);
    });

    completeEl.addEventListener('click', async e =>{
      e.preventDefault();
      const payload = {
        complete: true
      }
      bodyEl.classList.add('complete-body');
      const res = await postAPI.patch(`/todos/${post.id}?${post.complete}`, payload);
    });

    modifyEl.addEventListener('click', async e=>{
      e.preventDefault();
      bodyEl.appendChild(modifyFragment);
      completeEl.remove();
      modifyEl.remove();
      deleteEl.remove();           
    })

    modifyBtnEl.addEventListener('submit', async e => {
      e.preventDefault();
      const payload = {
        body: e.target.elements.body.value,
        complete: false
      }
      const res = await postAPI.patch(`/todos/${post.id}`, payload);
      indexPage();
    })

    modifyCancelBtnEl.addEventListener('click', async e => { 
      indexPage();
    })

  })

formEl.addEventListener('submit', async e =>{
  e.preventDefault();
  const payload = {
    body: e.target.elements.body.value,
    complete: false
  }
  const formRes = await postAPI.post('/todos',payload);
  indexPage();
})

  render(listFragment);
}

indexPage();