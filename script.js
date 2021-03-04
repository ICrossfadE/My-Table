const userlist = [
  {
     "full_name":"Janes Doe",
     "email":"janes.doe@gmail.com",
     "age":22
  },
  {
     "full_name":"Olivia Doe",
     "email":"olivia.doe@gmail.com",
     "age":20
  }
];

//!!
(function(arrTask){
  const objectTask = arrTask.reduce((acc, task) => {
    
    acc[task.email] = task
    
    return acc
  }, {})

  //add LocalStorage
  Object.values(objectTask).forEach(task => {
    localStorage.setItem(task.email, JSON.stringify(task))
  })
  

  //DOM Elements
  const tableContent = document.querySelector('tbody')
  const btnAllDelete = document.querySelector('#btn-deleteAll');
  const form = document.forms['addTask'];
  const inputName = form.elements['name'];
  const inputEmail = form.elements['email'];
  const inputAge = form.elements['age'];

  renderAllTask(localStorage);

  //Events
  tableContent.addEventListener('click', onDelete)
  
  //modal events
  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const nameValue = inputName.value;
    const emailValue = inputEmail.value;
    const ageValue = inputAge.value;

    if(!nameValue || !emailValue || !ageValue) {
      console.error;('!');
    } else {
      const task = createNewObjectElement(nameValue, emailValue, ageValue);
      const taskItem = tableItem(task)
      tableContent.appendChild(taskItem)
      form.reset()
    }
  
    function createNewObjectElement(fullName, email, age) {
      const newPerson = {
      full_name : fullName,
      email : email,
      age : age
      }

      localStorage.setItem(newPerson.email, JSON.stringify(newPerson))
      objectTask[newPerson.email] = newPerson

      return {...newPerson}
    }
  })
  btnAllDelete.addEventListener('click', () => {
    localStorage.clear()
    let domElements = Array.prototype.slice.call(tableContent.children)

    domElements.forEach(elem => deleteTaskFromHtml(elem));
    domElements.splice(0, domElements.length)
  })
  
  function renderAllTask(taskList) {
    if(!taskList) {
      console.error('!');
      return
    }

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < localStorage.length; i++){      
      let key = localStorage.key(i);
      const tr = tableItem(JSON.parse(localStorage.getItem(key)));
      fragment.appendChild(tr)
    }
 
    // console.log(localStorage);
    tableContent.appendChild(fragment);
  }

  function deleteTaskFromHtml(element) {
    element.remove()
  }

  function deleteTask(id) {
    localStorage.removeItem(id)
  }

  function onDelete(e) {
    if (e.target.classList.contains('btn-delete')){
      const parent = e.target.closest('[data-task-id]');
      const id = parent.dataset.taskId;
      console.log(parent);
      deleteTaskFromHtml(parent);
      deleteTask(id);
    }
  }

  function tableItem({full_name, email, age} = {}) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-task-id', email);
   
    tr.innerHTML = `
      <td>${full_name}</td>
      <td>${email}</td>
      <td>${age}</td>
      <td style="padding: 0;"><button type="button" class="btn btn-danger btn-delete">Delete</button></td>`
    return tr  
  }

}(userlist))